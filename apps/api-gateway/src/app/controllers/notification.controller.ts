import { AuthRequest } from '@be/shared';
import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getNotifications(@Request() req: AuthRequest) {
    this.logger.log(`Getting notifications for user ${req.user.id}`);
    return this.notificationService.getNotificationsByUserId(req.user.id);
  }
}
