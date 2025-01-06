import { CreateUser, Login } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  createUser(data: CreateUser) {
    return this.userService.send({ cmd: 'create_user' }, data).toPromise();
  }

  login(data: Login) {
    return this.userService.send({ cmd: 'login' }, data).toPromise();
  }
}
