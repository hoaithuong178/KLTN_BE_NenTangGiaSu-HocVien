import { JWTInput } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_me' })
  getMe(data: JWTInput) {
    return this.userService.getMe(data.id);
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  getUserById(data: { id: string }) {
    return this.userService.getUserById(data.id);
  }
}
