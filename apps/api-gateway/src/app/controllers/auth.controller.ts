import {
  AuthRequest,
  FacebookTokenVerificationDto,
  GoogleTokenVerificationDto,
  Login,
  OTPRegister,
  Register,
} from '@be/shared';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
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

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: AuthRequest,
    @Body('refreshToken') refreshToken: string
  ) {
    this.logger.log(
      `Received request to logout ${JSON.stringify(
        req.user
      )} and refreshToken ${JSON.stringify(refreshToken)}`
    );

    return await this.authService.logout({
      expiredAt: new Date(req.user.exp * 1000),
      id: req.user.jwtId,
      refreshToken,
    });
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    this.logger.log(`Received request to refresh token`);

    return await this.authService.refreshToken(refreshToken);
  }

  @Post('google')
  async googleAuth(@Body() data: GoogleTokenVerificationDto) {
    this.logger.log(`Received request to authenticate with Google`);

    return await this.authService.googleAuth(data);
  }

  @Post('facebook')
  async facebookAuth(@Body() data: FacebookTokenVerificationDto) {
    this.logger.log(`Received request to authenticate with Facebook`);

    return await this.authService.facebookAuth(data);
  }
}
