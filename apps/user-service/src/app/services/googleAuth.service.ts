import { AuthProvider, Role } from '.prisma/user-service';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Auth, google } from 'googleapis';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class GoogleAuthService {
  private readonly oauthClient: Auth.OAuth2Client;
  private readonly logger: Logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    this.logger.log(`Authenticating with Google token: ${token}`);

    try {
      // Xác thực ID token thay vì sử dụng getTokenInfo
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      const email = payload.email;

      if (!email) {
        throw new UnauthorizedException(
          'Google authentication failed: No email found'
        );
      }

      // Tìm user trong database hoặc tạo mới
      const user = await this.userService.findUserByEmail(email);

      if (user) {
        return this.authService.createAuthResponse(user);
      }

      // Tạo user mới
      const newUser = await this.userService.createWithGoogle({
        email: email,
        name: payload.name,
        authProvider: AuthProvider.GOOGLE,
        role: Role.STUDENT,
        password: '',
        avatar: payload.picture ?? undefined,
      });

      if (payload.picture) {
        this.userClient.emit('update_avatar', {
          id: newUser.id,
          avatar: payload.picture,
        });
      }

      return this.authService.createAuthResponse(newUser);
    } catch (error) {
      this.logger.error(`Google authentication failed:`, error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async getUserData(token: string) {
    this.oauthClient.setCredentials({ access_token: token });

    const userInfoClient = google.oauth2('v2').userinfo;

    const userInfo = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfo.data;
  }

  googleLogin(req) {
    if (!req.user) {
      return 'Không có người dùng từ Google';
    }

    return {
      message: 'Thông tin người dùng từ Google',
      user: req.user,
    };
  }
}
