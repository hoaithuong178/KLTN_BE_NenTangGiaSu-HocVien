import { AuthRequest } from '@be/shared';
import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
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
}
