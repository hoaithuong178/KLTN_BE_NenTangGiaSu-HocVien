import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { NotificationController } from './controllers/notification.controller';
import { TutorController } from './controllers/tutor.controller';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/userProfile.controller';
import { PrismaModule } from './prisma/prisma.module';
import { InvalidTokenRepository } from './repositories/invalidToken.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { TutorRepository } from './repositories/tutor.repository';
import { UserRepository } from './repositories/user.repository';
import { UserProfileRepository } from './repositories/userProfile.repository';
import { AuthService } from './services/auth.service';
import { CleanupTokenService } from './services/cleanupToken.service';
import { NotificationService } from './services/notification.service';
import { TutorService } from './services/tutor.service';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/userProfile.service';

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
    ClientsModule.register(registerServices('EDUCATION', 'CHATBOT_USER')),
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TutorController,
    UserProfileController,
    NotificationController,
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
  ],
})
export class AppModule {}
