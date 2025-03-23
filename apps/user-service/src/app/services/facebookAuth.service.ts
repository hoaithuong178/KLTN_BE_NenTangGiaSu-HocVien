import { AuthProvider, Role } from '.prisma/user-service';
import { FacebookTokenVerificationDto } from '@be/shared';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class FacebookAuthService {
  private readonly logger: Logger = new Logger(FacebookAuthService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
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
        avatar: profile.picture?.data.url ?? undefined,
      });

      if (profile.picture?.data.url)
        this.userClient.emit('update_avatar', {
          id: newUser.id,
          avatar: profile.picture?.data.url,
        });

      return this.authService.createAuthResponse(newUser);
    } catch (error) {
      this.logger.error(`Facebook authentication failed:`, error);
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }
}
