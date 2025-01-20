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
}
