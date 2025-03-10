import { verifyToken } from '@be/shared';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (!token) return false;

    const [bearer, authToken] = token.split(' ');

    if (bearer !== 'Bearer' || !authToken) return false;

    const decoded = verifyToken(authToken);

    if (typeof decoded === 'string') return false;

    // Kiểm tra token có trong bảng invalid_tokens không
    try {
      const isInvalidToken = await lastValueFrom(
        this.userService.send(
          { cmd: 'check_invalid_token' },
          {
            id: decoded.jwtId,
          }
        )
      );

      if (isInvalidToken) return false;
    } catch (error) {
      this.logger.error(error);

      return false;
    }

    request.user = decoded;

    return true;
  }
}
