import {
  GoogleTokenVerificationDto,
  Login,
  Logout,
  Register,
} from '@be/shared';
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

  logout(data: Logout) {
    return lastValueFrom(this.userService.send({ cmd: 'logout' }, data));
  }

  refreshToken(refreshToken: string) {
    return lastValueFrom(
      this.userService.send({ cmd: 'refresh_token' }, refreshToken)
    );
  }

  googleAuth(data: GoogleTokenVerificationDto) {
    return lastValueFrom(this.userService.send({ cmd: 'google_auth' }, data));
  }
}
