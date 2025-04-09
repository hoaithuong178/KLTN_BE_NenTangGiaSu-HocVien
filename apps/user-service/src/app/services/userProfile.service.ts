import { UserProfile } from '.prisma/user-service';
import {
  BaseResponse,
  CreateUserProfile,
  REDIS_KEY,
  UpdateUserProfile,
  uploadFile,
} from '@be/shared';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import Redis from '../configs/redis.config';
import { UserRepository } from '../repositories/user.repository';
import { UserProfileRepository } from '../repositories/userProfile.repository';

@Injectable()
export class UserProfileService {
  private readonly logger: Logger = new Logger(UserProfileService.name);

  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userRepository: UserRepository,
    @Inject('CHATBOT_USER_SERVICE')
    private readonly chatbotUserService: ClientProxy,
    @Inject('EDUCATION_SERVICE') private readonly educationService: ClientProxy
  ) {}

  updateAvatar(userId: string, avatar: string) {
    lastValueFrom(
      this.educationService.send(
        { cmd: 'user-update-avatar' },
        {
          userId,
          avatar,
        }
      )
    )
      .then(() => {
        this.logger.log('User updated avatar in education service');
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  async create(data: CreateUserProfile) {
    this.logger.log(`Creating user profile with data: ${JSON.stringify(data)}`);

    const user = await this.userProfileRepository.getUserProfileById(data.id);

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

    const userProfile = await this.userProfileRepository.createUserProfile({
      ...data,
      avatar,
    });

    this.updateAvatar(userProfile.id, avatar);

    this.userRepository.getFullInfo(userProfile.id).then((user) => {
      this.logger.log('User: ' + JSON.stringify(user));
      this.chatbotUserService.emit('user-created', user);
    });

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: userProfile,
    };

    return response;
  }

  async update(id: string, data: UpdateUserProfile) {
    this.logger.log(`Updating user profile with id: ${id}`);

    const user = await this.userProfileRepository.getUserProfileById(id);

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

    const userProfile = await this.userProfileRepository.updateUserProfile(id, {
      ...data,
      avatar,
    });

    this.userRepository.getFullInfo(id).then((user) => {
      this.chatbotUserService.emit('user-updated', user);
    });

    this.updateAvatar(userProfile.id, data.avatar ? avatar : user.avatar);

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: userProfile,
    };

    return response;
  }

  async get(id: string) {
    this.logger.log(`Getting user profile with id: ${id}`);

    const userProfile = await this.userProfileRepository.getUserProfileById(id);

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
      const userProfile = await this.userProfileRepository.getUserProfileById(
        id
      );
      await this.userProfileRepository.deleteUserProfile(id);

      this.updateAvatar(userProfile.id, '');

      this.userRepository.getFullInfo(userProfile.id).then((user) => {
        this.chatbotUserService.emit('user-deleted', user);
      });

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

  async updateWalletAddress(id: string, walletAddress: string) {
    const userProfile = await this.userProfileRepository.getUserProfileById(id);

    if (!userProfile) {
      throw new RpcException({
        statusCode: 404,
        message: 'Hồ sơ người dùng không tồn tại',
      });
    }

    if (userProfile.walletAddress) {
      throw new RpcException({
        statusCode: 400,
        message: 'Người dùng đã có địa chỉ ví',
      });
    }

    const updatedUserProfile =
      await this.userProfileRepository.updateWalletAddress(id, walletAddress);

    const response: BaseResponse<UserProfile> = {
      statusCode: HttpStatus.OK,
      data: updatedUserProfile,
    };

    return response;
  }

  async getWalletAddress(id: string) {
    this.logger.log(`Getting wallet address with id: ${id}`);

    const walletAddressCache = await Redis.getInstance()
      .getClient()
      .get(REDIS_KEY.walletAddress(id));

    if (walletAddressCache) return JSON.parse(walletAddressCache);

    const userProfile = await this.userProfileRepository.getWalletAddress(id);

    if (!userProfile) {
      throw new RpcException({
        statusCode: 404,
        message: 'Hồ sơ người dùng không tồn tại',
      });
    }

    if (!userProfile.walletAddress) {
      throw new RpcException({
        statusCode: 404,
        message: 'Người dùng chưa có địa chỉ ví',
      });
    }

    const response: BaseResponse<string> = {
      statusCode: HttpStatus.OK,
      data: userProfile.walletAddress,
    };

    Redis.getInstance()
      .getClient()
      .set(REDIS_KEY.walletAddress(id), JSON.stringify(response.data))
      .catch((err) => {
        this.logger.error(`Lưu cache wallet address thất bại: ${err}`);
      });

    return response;
  }
}
