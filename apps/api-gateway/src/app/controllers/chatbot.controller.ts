import { Role } from '.prisma/user-service';
import { AuthRequest } from '@be/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ChatbotService } from '../services/chatbot.service';
import { IChatbotAnswerRequest } from '../types';

@Controller('chatbot')
export class ChatbotController {
  private readonly logger: Logger = new Logger(ChatbotController.name);

  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR, Role.STUDENT])
  @HttpCode(HttpStatus.CREATED)
  async answer(
    @Request() req: AuthRequest,
    @Body() data: IChatbotAnswerRequest
  ) {
    this.logger.log(`Answer chatbot: ${JSON.stringify(data)}`);

    const newData = {
      ...data,
      user_id: req.user.id,
    };

    if (req.user.role === Role.STUDENT)
      return await this.chatbotService.answerStudent(newData);

    return await this.chatbotService.answerTutor(newData);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR, Role.STUDENT])
  async getConversation(@Request() req: AuthRequest) {
    this.logger.log(`Get conversation: ${req.user.id}`);

    if (req.user.role === Role.STUDENT)
      return await this.chatbotService.getConversationStudent(req.user.id);

    return await this.chatbotService.getConversationTutor(req.user.id);
  }
}
