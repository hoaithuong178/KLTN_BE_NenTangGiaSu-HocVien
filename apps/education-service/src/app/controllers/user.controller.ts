import { User } from '.prisma/education-service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user-create-user' })
  createUser(data: User) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'user-update-avatar' })
  updateAvatar(data: { userId: string; avatar: string }) {
    return this.userService.updateAvatar(data.userId, data.avatar);
  }
}
