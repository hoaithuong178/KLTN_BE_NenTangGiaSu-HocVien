import { Login, Logout, Register } from '@be/shared';
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

  @MessagePattern({ cmd: 'logout' })
  logout(data: Logout) {
    return this.authService.logout(data);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  refreshToken(data: string) {
    return this.authService.refreshToken(data);
  }

  @MessagePattern({ cmd: 'check_invalid_token' })
  checkInvalidToken(data: { id: string }) {
    return this.authService.checkInvalidToken(data.id);
  }
}
