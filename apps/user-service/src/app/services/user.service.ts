import { User, UserStatus } from '.prisma/user-service';
import {
  BaseResponse,
  CreateUserWithGoogle,
  GetUserForAdmin,
  REDIS_KEY,
  uploadImageFromUrl,
  UserWithAvatar,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import elasticClient from '../configs/elastic.config';
import Redis from '../configs/redis.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  private toUserWithAvatar<
    T extends { userProfiles: { avatar: string }[]; avatar: string }
  >(user: T) {
    const { userProfiles, ...restData } = user;

    return {
      ...restData,
      avatar: user.avatar ?? userProfiles?.[0]?.avatar ?? null,
    };
  }

  async getMe(id: string) {
    this.logger.log(`Getting user with id: ${id}`);

    const user = await this.userRepository.findUserById(id);

    const response: BaseResponse<UserWithAvatar> = {
      statusCode: HttpStatus.OK,
      data: this.toUserWithAvatar(user),
    };

    return response;
  }

  async getFullInfo(id: string) {
    const user = await this.userRepository.getFullInfo(id);

    const response: BaseResponse<User> = {
      statusCode: HttpStatus.OK,
      data: user,
    };

    return response;
  }

  async syncToElasticSearch(id: string) {
    this.logger.log(`Syncing user to ElasticSearch with id: ${id}`);

    const [tutor, user] = await Promise.all([
      new Promise<{
        found: boolean;
      }>((resolve, reject) => {
        elasticClient
          .get({
            index: TUTOR_INDEX,
            id,
          })
          .then(resolve)
          .catch((error) => {
            if (error.meta.statusCode === 404) {
              resolve(error);
            } else reject(new Error(error.message || 'Failed to get tutor'));
          });
      }), // this.getTutorById(id),
      this.userRepository.getFullInfo(id),
    ]);

    if (!user) throw new Error('User not found');

    const { userProfiles, tutorProfiles, ...restData } = user;

    const newData = {
      ...restData,
      userProfile: userProfiles.length ? userProfiles[0] : null,
      tutorProfile: tutorProfiles.length ? tutorProfiles[0] : null,
    };

    if (tutor.found) {
      await elasticClient.update({
        index: TUTOR_INDEX,
        id: id,
        body: {
          doc: newData,
        },
      });
    } else
      await elasticClient.index({
        index: TUTOR_INDEX,
        id: id,
        body: newData,
      });
  }

  async getUserById(id: string) {
    const USER_KEY = REDIS_KEY.user(id);

    const userCached = await Redis.getInstance().getClient().get(USER_KEY);

    if (userCached) return JSON.parse(userCached);

    const user = await this.userRepository.findUserById(id);

    const response: BaseResponse<UserWithAvatar> = {
      statusCode: HttpStatus.OK,
      data: this.toUserWithAvatar(user),
    };

    Redis.getInstance().getClient().set(USER_KEY, JSON.stringify(response));

    return response;
  }

  async getUsersForAdmin() {
    const users = await this.userRepository.getUsersForAdmin();

    const response: BaseResponse<User[]> = {
      statusCode: HttpStatus.OK,
      data: users,
    };

    return response;
  }

  async updateUserStatus(id: string, status: UserStatus) {
    this.logger.log(`Updating user status: ${id} - ${status}`);

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: ['Không tìm thấy người dùng'],
        success: false,
      });
    }

    const updatedUser = await this.userRepository.updateUserStatus(id, status);

    const response: BaseResponse<User> = {
      statusCode: HttpStatus.OK,
      data: updatedUser,
    };

    return response;
  }

  async updateOnlineStatus(userId: string, isOnline: boolean) {
    this.logger.log(`Updating online status for user: ${userId} - ${isOnline}`);

    return this.userRepository.updateOnlineStatus(userId, isOnline);
  }

  async findUserByEmail(email: string) {
    this.logger.log(`Finding user by email: ${email}`);

    return this.userRepository.findUserByEmail(email);
  }

  async createWithGoogle(data: CreateUserWithGoogle) {
    this.logger.log(`Creating user with Google: ${data.email}`);

    return this.userRepository.createWithGoogle(data);
  }

  async updateAvatar(id: string, avatar: string) {
    const url = await uploadImageFromUrl({
      imageUrl: avatar,
      folder: 'avatar',
    });

    return this.userRepository.updateAvatar(id, url);
  }

  async getUserForAdmin(data: GetUserForAdmin) {
    this.logger.log(`Getting user for admin: ${JSON.stringify(data)}`);

    const users = await this.userRepository.getUserForAdmin(data);

    const response = {
      statusCode: HttpStatus.OK,
      data: users,
    };

    return response;
  }

  async syncAllTutorsToElasticSearch() {
    this.logger.log('Starting sync all tutors to ElasticSearch');

    try {
      const tutors = await this.userRepository.getAllTutors();

      // Xóa index cũ nếu tồn tại
      const indexExists = await elasticClient.indices.exists({
        index: TUTOR_INDEX,
      });

      if (indexExists) {
        await elasticClient.indices.delete({
          index: TUTOR_INDEX,
        });
      }

      // Tạo index mới
      await elasticClient.indices.create({
        index: TUTOR_INDEX,
      });

      // Bulk insert posts vào Elasticsearch
      const body = tutors.flatMap((post) => [
        { index: { _index: TUTOR_INDEX, _id: post.id } },
        post,
      ]);

      if (body.length > 0) {
        const response = await elasticClient.bulk({ body });
        if (response.errors) {
          this.logger.error('Lỗi khi bulk insert vào Elasticsearch');
        }
      }

      this.logger.log(`Đã đồng bộ ${tutors.length} tutors vào Elasticsearch`);
    } catch (error) {
      this.logger.error('Lỗi khi đồng bộ tutors vào Elasticsearch', error);
    }
  }

  async getAdminId() {
    this.logger.log('Getting admin id');

    const adminIdCached = await Redis.getInstance()
      .getClient()
      .get(REDIS_KEY.adminId());

    if (adminIdCached) return JSON.parse(adminIdCached);

    const adminId = await this.userRepository.getAdminId();

    const response: BaseResponse<string> = {
      statusCode: HttpStatus.OK,
      data: adminId.id,
    };

    Redis.getInstance()
      .getClient()
      .set(REDIS_KEY.adminId(), JSON.stringify(response));

    return response;
  }
}
