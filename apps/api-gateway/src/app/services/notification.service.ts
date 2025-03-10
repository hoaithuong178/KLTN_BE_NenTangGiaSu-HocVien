import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  getNotificationsByUserId(userId: string) {
    return lastValueFrom(
      this.userService.send(
        { cmd: 'get_user_notifications' },
        { recipientId: userId }
      )
    );
  }
}
