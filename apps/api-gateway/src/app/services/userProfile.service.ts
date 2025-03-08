import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserProfileService {
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
}
