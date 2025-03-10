import { Notification } from '.prisma/user-service';
import { BaseResponse, CreateNotificationRequest } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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

      const response: BaseResponse<Notification[]> = {
        statusCode: 200,
        data: notifications,
      };

      return response;
    } catch (error) {
      throw new RpcException(error.message || 'Lỗi khi lấy thông báo');
    }
  }

  async markAsRead(id: string, recipientId: string) {
    try {
      const notification = await this.notificationRepository.findById(id);

      if (!notification) {
        throw new RpcException('Không tìm thấy thông báo');
      }

      if (notification.recipientId !== recipientId) {
        throw new RpcException('Bạn không có quyền đánh dấu thông báo này');
      }

      const updatedNotification = await this.notificationRepository.markAsRead(
        id
      );

      const response: BaseResponse<Notification> = {
        statusCode: 200,
        data: updatedNotification,
      };

      return response;
    } catch (error) {
      throw new RpcException(
        error.message || 'Lỗi khi đánh dấu đã đọc thông báo'
      );
    }
  }

  async deleteNotification(id: string, recipientId: string) {
    try {
      const notification = await this.notificationRepository.findById(id);

      if (!notification) {
        throw new RpcException('Không tìm thấy thông báo');
      }

      if (notification.recipientId !== recipientId) {
        throw new RpcException('Bạn không có quyền xóa thông báo này');
      }

      await this.notificationRepository.deleteNotification(id);

      return {
        statusCode: 200,
      };
    } catch (error) {
      throw new RpcException(error.message || 'Lỗi khi xóa thông báo');
    }
  }
}
