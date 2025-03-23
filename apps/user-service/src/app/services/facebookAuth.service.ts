import { AuthProvider, Role } from '.prisma/user-service';
import { FacebookTokenVerificationDto } from '@be/shared';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class FacebookAuthService {
  private readonly logger: Logger = new Logger(FacebookAuthService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  async authenticate(profile: FacebookTokenVerificationDto) {
    this.logger.log(
      `Authenticating with Facebook token: ${JSON.stringify(profile)}`
    );

    try {
      const { email } = profile;

      // Tìm user trong database hoặc tạo mới
      const user = await this.userService.findUserByEmail(email);

      if (user) {
        return this.authService.createAuthResponse(user);
      }

      // Tạo user mới
      const newUser = await this.userService.createWithGoogle({
        email,
        name: profile.name,
        authProvider: AuthProvider.FACEBOOK,
        role: Role.STUDENT,
        password: '',
      });

      return this.authService.createAuthResponse(newUser);
    } catch (error) {
      this.logger.error(`Facebook authentication failed:`, error);
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }
}
