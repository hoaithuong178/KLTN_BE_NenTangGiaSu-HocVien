import { FacebookTokenVerificationDto } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FacebookAuthService } from '../services/facebookAuth.service';

@Controller('auth')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  @MessagePattern({ cmd: 'facebook_auth' })
  authenticate(data: FacebookTokenVerificationDto) {
    return this.facebookAuthService.authenticate(data);
  }
}
