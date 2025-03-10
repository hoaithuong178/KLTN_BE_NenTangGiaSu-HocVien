import { NotificationType } from '.prisma/user-service';

export class CreateNotificationRequest {
  title!: string;
  message!: string;
  recipientId!: string;
  type!: NotificationType;
  link?: string;
}
