import { BaseResponse } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChatbotRepository } from '../repositories/chatbot.repository';
import { IChatbotAnswerRequest } from '../types';

@Injectable()
export class ChatbotService {
  private readonly logger: Logger = new Logger(ChatbotService.name);

  constructor(private readonly chatbotRepository: ChatbotRepository) {}

  async answerStudent(data: IChatbotAnswerRequest) {
    this.logger.log(`Answer student: ${JSON.stringify(data)}`);

    const res = await this.chatbotRepository.answerStudent(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.CREATED,
      data: res,
    };

    return response;
  }

  async answerTutor(data: IChatbotAnswerRequest) {
    this.logger.log(`Answer tutor: ${JSON.stringify(data)}`);

    const res = await this.chatbotRepository.answerTutor(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.CREATED,
      data: res,
    };

    return response;
  }

  async getConversationStudent(userId: string) {
    this.logger.log(`Get conversation student: ${userId}`);

    const res = await this.chatbotRepository.getConversationStudent(userId);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }

  async getConversationTutor(userId: string) {
    this.logger.log(`Get conversation tutor: ${userId}`);

    const res = await this.chatbotRepository.getConversationTutor(userId);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }
}
