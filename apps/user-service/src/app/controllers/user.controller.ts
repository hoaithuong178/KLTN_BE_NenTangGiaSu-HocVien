import { UserStatus } from '.prisma/user-service';
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

  @MessagePattern({ cmd: 'get_users_for_admin' })
  getUsersForAdmin() {
    return this.userService.getUsersForAdmin();
  }

  @MessagePattern({ cmd: 'update_user_status' })
  updateUserStatus(data: { id: string; status: UserStatus }) {
    return this.userService.updateUserStatus(data.id, data.status);
  }
}
