import { Login, Register } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  createUser(data: Register) {
    return lastValueFrom(this.userService.send({ cmd: 'create_user' }, data));
  }

  login(data: Login) {
    return lastValueFrom(this.userService.send({ cmd: 'login' }, data));
  }

  otpRegister(data: string) {
    return lastValueFrom(this.userService.send({ cmd: 'otp_register' }, data));
  }
}
