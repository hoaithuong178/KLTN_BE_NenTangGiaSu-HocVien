import { CreateMessageDto } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { getReceiverId } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly prismaService: PrismaService
  ) {}

  async saveMessage(data: CreateMessageDto) {
    this.logger.log(`Saving message: ${JSON.stringify(data)}`);

    const conversation = await this.conversationRepo.findById(
      data.conversationId
    );

    if (!conversation) {
      await this.conversationRepo.create({
        id: data.conversationId,
        tutorId: data.senderId,
        studentId: getReceiverId(data.conversationId, data.senderId),
      });
    }

    this.logger.log(`Saving message: ${JSON.stringify(data)}`);

    const [savedMessage] = await this.prismaService.$transaction([
      this.messageRepo.create(data),
      this.conversationRepo.updateLastMessageTime(data.conversationId),
    ]);

    return savedMessage;
  }

  async getConversationMessages(conversationId: string) {
    this.logger.log(`Getting conversation messages: ${conversationId}`);

    return this.messageRepo.findByConversationId(conversationId);
  }
}
