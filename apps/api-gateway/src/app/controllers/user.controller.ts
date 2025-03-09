import { Role, UserStatus } from '.prisma/user-service';
import { AuthRequest } from '@be/shared';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() data: AuthRequest) {
    this.logger.log(
      `Received request to get user ${JSON.stringify(data.user)}`
    );

    return await this.userService.getMe(data.user);
  }

  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async getUsersForAdmin() {
    return await this.userService.getUsersForAdmin();
  }

  @Patch('admin/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: UserStatus }
  ) {
    return await this.userService.updateUserStatus(id, body.status);
  }
}
