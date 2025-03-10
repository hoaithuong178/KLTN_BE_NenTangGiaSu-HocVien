import { CreateNotificationRequest } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('create_notification')
  createNotification(data: CreateNotificationRequest) {
    return this.notificationService.createNotification(data);
  }

  @MessagePattern({ cmd: 'get_user_notifications' })
  getNotificationsByUserId(data: { recipientId: string }) {
    return this.notificationService.getNotificationsByUserId(data.recipientId);
  }
}
