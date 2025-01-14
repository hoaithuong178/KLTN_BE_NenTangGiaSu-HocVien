import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserProfileService } from '../services/userProfile.service';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @MessagePattern({ cmd: 'create_user_profile' })
  create(data: CreateUserProfile) {
    return this.userProfileService.create(data);
  }

  @MessagePattern({ cmd: 'update_user_profile' })
  update(data: { id: string; data: UpdateUserProfile }) {
    return this.userProfileService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'get_user_profile' })
  get(id: string) {
    return this.userProfileService.get(id);
  }

  @MessagePattern({ cmd: 'delete_user_profile' })
  delete(id: string) {
    return this.userProfileService.delete(id);
  }
}
