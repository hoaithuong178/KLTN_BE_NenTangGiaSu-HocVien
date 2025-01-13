import { Login, Register } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'create_user' })
  register(data: Register) {
    return this.authService.createUser(data);
  }

  @MessagePattern({ cmd: 'login' })
  login(data: Login) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'otp_register' })
  otpRegister(data: string) {
    return this.authService.otpRegister(data);
  }
}
