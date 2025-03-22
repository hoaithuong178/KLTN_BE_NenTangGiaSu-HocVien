import { GoogleTokenVerificationDto } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GoogleAuthService } from '../services/googleAuth.service';

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @MessagePattern({ cmd: 'google_auth' })
  authenticate(tokenData: GoogleTokenVerificationDto) {
    return this.googleAuthService.authenticate(tokenData.token);
  }
}
