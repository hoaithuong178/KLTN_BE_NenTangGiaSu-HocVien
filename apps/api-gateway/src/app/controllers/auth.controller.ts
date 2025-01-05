import { CreateUser } from '@be/shared';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async getUser(@Body() data: CreateUser) {
    this.logger.log(
      `Received request to register user ${JSON.stringify(data)}`
    );

    return await this.authService.createUser(data);
  }
}
