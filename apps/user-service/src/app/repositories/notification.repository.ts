import { CreateNotificationRequest } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createNotification(data: CreateNotificationRequest) {
    return this.prismaService.notification.create({
      data,
    });
  }

  getNotificationsByUserId(recipientId: string) {
    return this.prismaService.notification.findMany({
      where: {
        recipientId,
        deleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prismaService.notification.findUnique({
      where: { id },
    });
  }

  markAsRead(id: string) {
    return this.prismaService.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  deleteNotification(id: string) {
    return this.prismaService.notification.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
