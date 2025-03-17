class MediaDto {
  id!: string;
  url!: string;
  type!: string;
  size!: number;
}

export class CreateMessageDto {
  id!: string;
  senderId!: string;
  conversationId!: string;
  message!: string;
  sentAt!: Date;
  media!: MediaDto[];
}
