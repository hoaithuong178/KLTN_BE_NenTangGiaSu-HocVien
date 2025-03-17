import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  async getConversationMessages(conversationId: string) {
    this.logger.log(`Getting messages for conversation: ${conversationId}`);
    return lastValueFrom(
      this.userService.send(
        { cmd: 'get_conversation_messages' },
        conversationId
      )
    );
  }

  getUserConversations(userId: string) {
    return lastValueFrom(
      this.userService.send({ cmd: 'get_user_conversations' }, userId)
    );
  }
}
