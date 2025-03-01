import { UserProfile } from '.prisma/user-service';
import {
  BaseResponse,
  CreateUserProfile,
  UpdateUserProfile,
  uploadFile,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserProfileRepository } from '../repositories/userProfile.repository';

@Injectable()
export class UserProfileService {
  private readonly logger: Logger = new Logger(UserProfileService.name);

  constructor(private readonly UserProfileRepository: UserProfileRepository) {}

  async create(data: CreateUserProfile) {
    this.logger.log(`Creating user profile with data: ${JSON.stringify(data)}`);

    const user = await this.UserProfileRepository.getUserProfileById(data.id);

    if (user) {
      throw new RpcException({
        statusCode: 400,
        message: 'Hồ sơ người dùng đã tồn tại',
      });
    }

    let avatar = null;

    if (data.avatar) {
      avatar = await uploadFile({
        file: data.avatar,
        folder: 'teachme/user-profile',
      });
    }

    const userProfile = await this.UserProfileRepository.createUserProfile({
      ...data,
      avatar,
    });

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: userProfile,
    };

    return response;
  }

  async update(id: string, data: UpdateUserProfile) {
    this.logger.log(`Updating user profile with id: ${id}`);

    const user = await this.UserProfileRepository.getUserProfileById(id);

    if (!user) {
      throw new RpcException({
        statusCode: 400,
        message: 'Hồ sơ người dùng không tồn tại',
      });
    }

    let avatar = null;

    if (data.avatar) {
      avatar = await uploadFile({
        file: data.avatar,
        folder: 'user-profile',
      });
    }

    const userProfile = await this.UserProfileRepository.updateUserProfile(id, {
      ...data,
      avatar,
    });

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: userProfile,
    };

    return response;
  }

  async get(id: string) {
    this.logger.log(`Getting user profile with id: ${id}`);

    const userProfile = await this.UserProfileRepository.getUserProfileById(id);

    if (!userProfile) {
      throw new RpcException({
        statusCode: 404,
        message: 'Hồ sơ người dùng không tồn tại',
      });
    }

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: userProfile,
    };

    return response;
  }

  async delete(id: string) {
    this.logger.log(`Deleting user profile with id: ${id}`);

    try {
      const userProfile = await this.UserProfileRepository.getUserProfileById(
        id
      );
      await this.UserProfileRepository.deleteUserProfile(id);

      const response: BaseResponse<UserProfile> = {
        statusCode: HttpStatus.OK,
        data: userProfile,
      };

      return response;
    } catch (error) {
      this.logger.error(
        `Delete user profile failed with error: ${error.message}`
      );

      throw new RpcException({
        statusCode: 500,
        message: 'Xóa hồ sơ người dùng thất bại',
      });
    }
  }
}
