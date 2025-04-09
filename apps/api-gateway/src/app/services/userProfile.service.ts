import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(@Inject('USER_SERVICE') private readonly service: ClientProxy) {}

  create(data: CreateUserProfile) {
    return lastValueFrom(
      this.service.send({ cmd: 'create_user_profile' }, data)
    );
  }

  update(id: string, data: UpdateUserProfile) {
    return lastValueFrom(
      this.service.send({ cmd: 'update_user_profile' }, { id, data })
    );
  }

  get(id: string) {
    return lastValueFrom(this.service.send({ cmd: 'get_user_profile' }, id));
  }

  delete(id: string) {
    return lastValueFrom(this.service.send({ cmd: 'delete_user_profile' }, id));
  }

  async updateWalletAddress(userId: string, walletAddress: string) {
    this.logger.log(`Cập nhật địa chỉ ví cho người dùng ${userId}`);

    return lastValueFrom(
      this.service.send(
        { cmd: 'update_wallet_address' },
        { userId, walletAddress }
      )
    );
  }

  getWalletAddress(id: string) {
    return lastValueFrom(this.service.send({ cmd: 'get_wallet_address' }, id));
  }
}
