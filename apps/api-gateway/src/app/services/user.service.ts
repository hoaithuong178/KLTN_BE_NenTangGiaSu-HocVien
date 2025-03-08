import { JWTInput } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  getMe(data: JWTInput) {
    return lastValueFrom(this.userService.send({ cmd: 'get_me' }, data));
  }

  getUserById(id: string) {
    return lastValueFrom(
      this.userService.send({ cmd: 'get_user_by_id' }, { id })
    );
  }
}
