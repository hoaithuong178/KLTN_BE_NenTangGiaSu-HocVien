import { CreateMessageDto } from '@be/shared';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @EventPattern('send_message')
  async handleMessage(data: CreateMessageDto) {
    await this.chatService.saveMessage(data);
  }

  @MessagePattern({ cmd: 'get_conversation_messages' })
  getConversationMessages(conversationId: string) {
    return this.chatService.getConversationMessages(conversationId);
  }

  @MessagePattern({ cmd: 'get_user_conversations' })
  getUserConversations(userId: string) {
    return this.chatService.getUserConversations(userId);
  }
}
