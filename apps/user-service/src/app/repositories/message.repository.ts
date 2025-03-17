import { CreateMessageDto } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ media, ...data }: CreateMessageDto) {
    return this.prismaService.message.create({
      data: {
        ...data,
        media: {
          createMany: {
            data: media,
          },
        },
      },
    });
  }

  findByConversationId(conversationId: string) {
    return this.prismaService.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });
  }
}
