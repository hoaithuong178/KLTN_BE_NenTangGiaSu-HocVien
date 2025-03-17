import { User, UserStatus } from '.prisma/user-service';
import { BaseResponse, UserWithAvatar } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import elasticClient from '../configs/elastic.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  private toUserWithAvatar<T extends { userProfiles: { avatar: string }[] }>(
    user: T
  ) {
    const { userProfiles, ...restData } = user;

    return {
      ...restData,
      avatar: userProfiles?.[0]?.avatar ?? null,
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
      new Promise<any>((resolve, reject) => {
        elasticClient
          .get({
            index: TUTOR_INDEX,
            id,
          })
          .then(resolve)
          .catch((error) => {
            if (error.meta.statusCode === 404) {
              resolve(error);
            } else reject(error);
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
    const user = await this.userRepository.findUserById(id);

    const response: BaseResponse<UserWithAvatar> = {
      statusCode: HttpStatus.OK,
      data: this.toUserWithAvatar(user),
    };

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
}
