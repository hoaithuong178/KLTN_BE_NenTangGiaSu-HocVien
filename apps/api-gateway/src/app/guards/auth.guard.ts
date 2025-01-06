import { verifyToken } from '@be/shared';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (!token) return false;

    const [bearer, authToken] = token.split(' ');

    if (bearer !== 'Bearer' || !authToken) return false;

    const decoded = verifyToken(authToken);

    if (typeof decoded === 'string') return false;

    request.user = decoded;

    return true;
  }
}
