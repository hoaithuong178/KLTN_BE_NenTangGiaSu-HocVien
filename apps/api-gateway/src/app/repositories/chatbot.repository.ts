import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import { IChatbotAnswerRequest } from '../types';

@Injectable()
export class ChatbotRepository {
  private readonly client: Axios;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.CHATBOT_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async answerStudent(data: IChatbotAnswerRequest) {
    const res = await this.client.post('/student/chat/answer', data);

    return res.data;
  }

  async answerTutor(data: IChatbotAnswerRequest) {
    const res = await this.client.post('/tutor/chat/answer', data);

    return res.data;
  }

  async getConversationStudent(userId: string) {
    const res = await this.client.get(`/student/chat/conversations`, {
      params: {
        userId,
      },
    });

    return res.data;
  }

  async getConversationTutor(userId: string) {
    const res = await this.client.get(`/tutor/chat/conversations`, {
      params: {
        userId,
      },
    });

    return res.data;
  }

  async deleteStudentConversation(userId: string) {
    const res = await this.client.delete(`/student/chat/conversations`, {
      params: { userId },
    });

    return res.data;
  }

  async deleteTutorConversation(userId: string) {
    const res = await this.client.delete(`/tutor/chat/conversations`, {
      params: { userId },
    });

    return res.data;
  }
}
