import { AuthRequest } from '@be/shared';
import {
  Controller,
  Get,
  Logger,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Get('conversations/:id/messages')
  @UseGuards(AuthGuard)
  async getConversationMessages(@Param('id') conversationId: string) {
    this.logger.log(`Getting messages for conversation: ${conversationId}`);
    return this.chatService.getConversationMessages(conversationId);
  }

  @Get('conversations')
  @UseGuards(AuthGuard)
  async getUserConversations(@Request() req: AuthRequest) {
    this.logger.log(`Getting conversations for user: ${req.user.id}`);
    return this.chatService.getUserConversations(req.user.id);
  }
}
