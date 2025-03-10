import { Notification } from '.prisma/user-service';
import { BaseResponse, CreateNotificationRequest } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async createNotification(data: CreateNotificationRequest) {
    const notification = await this.notificationRepository.createNotification(
      data
    );
    this.logger.log(`Created notification for user ${data.recipientId}`);

    const response: BaseResponse<Notification> = {
      statusCode: 201,
      data: notification,
    };

    return response;
  }

  async getNotificationsByUserId(recipientId: string) {
    try {
      const notifications =
        await this.notificationRepository.getNotificationsByUserId(recipientId);

      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể lấy thông báo',
        error: error.message,
      };
    }
  }
}
