import { ConversationDto } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  updateLastMessageTime(id: string) {
    return this.prismaService.conversation.update({
      where: { id },
      data: { lastMessageTime: new Date() },
    });
  }

  create(data: ConversationDto) {
    return this.prismaService.conversation.create({
      data: {
        ...data,
        lastMessageTime: new Date(),
      },
    });
  }

  findById(id: string) {
    return this.prismaService.conversation.findUnique({
      where: { id },
    });
  }
}
