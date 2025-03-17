import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { ChatGateway } from '../gateways/chat.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { UserRepository } from '../repositories/user.repository';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { HealthController } from './health.controller';

const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

if (!RABBIT_MQ_URL) {
  throw new Error('RABBIT_MQ_URL is not defined');
}

const registerServices = (...names: Array<string>): ClientsModuleOptions => {
  return names.map((name) => ({
    name: `${name}_SERVICE`,
    transport: Transport.RMQ,
    options: {
      urls: [RABBIT_MQ_URL],
      queue: `${name.toLowerCase()}_queue`,
      queueOptions: { durable: false },
    },
  }));
};

@Module({
  imports: [ClientsModule.register(registerServices('CHAT'))],
  controllers: [HealthController],
  providers: [
    PrismaService,
    ChatGateway,
    ChatService,
    ConversationRepository,
    MessageRepository,
    UserRepository,
    UserService,
  ],
})
export class HealthModule {}
