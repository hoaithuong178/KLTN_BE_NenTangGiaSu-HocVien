import { Login, OTPRegister, Register } from '@be/shared';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async getUser(@Body() data: Register) {
    this.logger.log(
      `Received request to register user ${JSON.stringify(data)}`
    );

    return await this.authService.createUser(data);
  }

  @Post('login')
  async login(@Body() data: Login) {
    this.logger.log(`Received request to login ${JSON.stringify(data)}`);

    return await this.authService.login(data);
  }

  @Post('otp-register')
  async otpRegister(@Body() data: OTPRegister) {
    this.logger.log(`Received request to register OTP ${JSON.stringify(data)}`);

    return await this.authService.otpRegister(data.email);
  }
}
