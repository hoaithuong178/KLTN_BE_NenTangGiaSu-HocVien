import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { ChatController } from './controllers/chat.controller';
import { FacebookAuthController } from './controllers/facebookAuth.controller';
import { GoogleAuthController } from './controllers/googleAuth.controller';
import { NotificationController } from './controllers/notification.controller';
import { TutorController } from './controllers/tutor.controller';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/userProfile.controller';
import { ViolateController } from './controllers/violate.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { ConversationRepository } from './repositories/conversation.repository';
import { InvalidTokenRepository } from './repositories/invalidToken.repository';
import { MessageRepository } from './repositories/message.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { TutorRepository } from './repositories/tutor.repository';
import { UserRepository } from './repositories/user.repository';
import { UserProfileRepository } from './repositories/userProfile.repository';
import { ViolateRepository } from './repositories/violate.repository';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { CleanupTokenService } from './services/cleanupToken.service';
import { FacebookAuthService } from './services/facebookAuth.service';
import { GoogleAuthService } from './services/googleAuth.service';
import { NotificationService } from './services/notification.service';
import { TutorService } from './services/tutor.service';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/userProfile.service';
import { ViolateService } from './services/violate.service';

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
  imports: [
    ClientsModule.register(
      registerServices('EDUCATION', 'CHATBOT_USER', 'CHAT', 'USER')
    ),
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TutorController,
    UserProfileController,
    NotificationController,
    ChatController,
    GoogleAuthController,
    FacebookAuthController,
    ViolateController,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    UserRepository,
    TutorService,
    TutorRepository,
    UserProfileService,
    UserProfileRepository,
    InvalidTokenRepository,
    CleanupTokenService,
    NotificationService,
    NotificationRepository,
    ChatGateway,
    ChatService,
    ConversationRepository,
    MessageRepository,
    GoogleAuthService,
    FacebookAuthService,
    ViolateService,
    ViolateRepository,
  ],
})
export class AppModule {}
