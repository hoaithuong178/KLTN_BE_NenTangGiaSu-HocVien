import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserProfileService {
  constructor(@Inject('USER_SERVICE') private readonly service: ClientProxy) {}

  create(data: CreateUserProfile) {
    return this.service.send({ cmd: 'create_user_profile' }, data).toPromise();
  }

  update(id: string, data: UpdateUserProfile) {
    return this.service
      .send({ cmd: 'update_user_profile' }, { id, data })
      .toPromise();
  }

  get(id: string) {
    return this.service.send({ cmd: 'get_user_profile' }, id).toPromise();
  }

  delete(id: string) {
    return this.service.send({ cmd: 'delete_user_profile' }, id).toPromise();
  }
}
