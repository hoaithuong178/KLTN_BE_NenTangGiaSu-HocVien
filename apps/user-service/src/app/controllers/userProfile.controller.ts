import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import elasticClient from '../configs/elastic.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { UserService } from '../services/user.service';
import { UserProfileService } from '../services/userProfile.service';

@Controller('user-profiles')
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ cmd: 'create_user_profile' })
  async create(data: CreateUserProfile) {
    const result = await this.userProfileService.create(data);

    if (result)
      this.userService.syncToElasticSearch(result.data.id).catch(console.error);

    return result;
  }

  @MessagePattern({ cmd: 'update_user_profile' })
  async update(data: { id: string; data: UpdateUserProfile }) {
    const result = await this.userProfileService.update(data.id, data.data);

    if (result)
      this.userService.syncToElasticSearch(result.data.id).catch(console.error);

    return result;
  }

  @MessagePattern({ cmd: 'get_user_profile' })
  get(id: string) {
    return this.userProfileService.get(id);
  }

  @MessagePattern({ cmd: 'delete_user_profile' })
  async delete(id: string) {
    const result = await this.userProfileService.delete(id);

    if (result) {
      elasticClient
        .delete({
          index: TUTOR_INDEX,
          id,
        })
        .then(() => {
          console.log('Deleted from elasticSearch');
        })
        .catch(console.error);
    }

    return result;
  }

  @MessagePattern({ cmd: 'update_wallet_address' })
  async updateWalletAddress({
    userId,
    walletAddress,
  }: {
    userId: string;
    walletAddress: string;
  }) {
    return this.userProfileService.updateWalletAddress(userId, walletAddress);
  }

  @MessagePattern({ cmd: 'get_wallet_address' })
  async getWalletAddress(id: string) {
    return this.userProfileService.getWalletAddress(id);
  }
}
