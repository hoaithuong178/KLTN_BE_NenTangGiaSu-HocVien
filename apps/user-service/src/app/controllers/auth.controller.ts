import { CreateUser, Login } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'create_user' })
  getUser(data: CreateUser) {
    return this.authService.createUser(data);
  }

  @MessagePattern({ cmd: 'login' })
  login(data: Login) {
    return this.authService.login(data);
  }
}
