import { UserStatus } from '.prisma/user-service';
import { GetUserForAdmin, JWTInput } from '@be/shared';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
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

  @EventPattern('update_avatar')
  updateAvatar(data: { id: string; avatar: string }) {
    return this.userService.updateAvatar(data.id, data.avatar);
  }

  @MessagePattern({ cmd: 'get_user_for_admin' })
  getUserForAdmin(data: GetUserForAdmin) {
    return this.userService.getUserForAdmin(data);
  }
}
