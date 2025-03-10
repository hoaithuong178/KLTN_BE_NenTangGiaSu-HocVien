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

  @MessagePattern({ cmd: 'mark_notification_as_read' })
  markAsRead(data: { id: string; recipientId: string }) {
    return this.notificationService.markAsRead(data.id, data.recipientId);
  }

  @MessagePattern({ cmd: 'delete_notification' })
  deleteNotification(data: { id: string; recipientId: string }) {
    return this.notificationService.deleteNotification(
      data.id,
      data.recipientId
    );
  }
}
