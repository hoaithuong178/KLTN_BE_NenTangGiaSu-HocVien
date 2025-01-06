import { JWTInput } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  getMe(data: JWTInput) {
    return this.userService.send({ cmd: 'get_me' }, data).toPromise();
  }
}
