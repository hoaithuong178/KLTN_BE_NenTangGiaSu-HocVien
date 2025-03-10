import { AuthRequest } from '@be/shared';
import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
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

  @Patch(':id/read')
  @UseGuards(AuthGuard)
  async markAsRead(@Param('id') id: string, @Request() req: AuthRequest) {
    this.logger.log(
      `Marking notification ${id} as read for user ${req.user.id}`
    );
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Param('id') id: string,
    @Request() req: AuthRequest
  ) {
    this.logger.log(`Deleting notification ${id} for user ${req.user.id}`);
    return this.notificationService.deleteNotification(id, req.user.id);
  }
}
