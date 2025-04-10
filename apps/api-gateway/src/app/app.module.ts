import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { BenefitController } from './controllers/benefit.controller';
import { BlockchainController } from './controllers/blockchain.controller';
import { ChatController } from './controllers/chat.controller';
import { ChatbotController } from './controllers/chatbot.controller';
import { ClassController } from './controllers/class.controller';
import { ClassPatternController } from './controllers/classPattern.controller';
import { ContractController } from './controllers/contract.controller';
import { FavoritePostController } from './controllers/favoritePost.controller';
import { LessonController } from './controllers/lesson.controller';
import { LessonPatternController } from './controllers/lessonPattern.controller';
import { NotificationController } from './controllers/notification.controller';
import { PaymentController } from './controllers/payment.controller';
import { PostController } from './controllers/post.controller';
import { RecommendController } from './controllers/recommend.controller';
import { RequestController } from './controllers/request.controller';
import { SubjectController } from './controllers/subject.controller';
import { TimeSlotController } from './controllers/timeSlot.controller';
import { TutorController } from './controllers/tutor.controller';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/userProfile.controller';
import { ViolateController } from './controllers/violate.controller';
import { ChatbotRepository } from './repositories/chatbot.repository';
import { RecommendRepository } from './repositories/recommend.repository';
import { AuthService } from './services/auth.service';
import { BenefitService } from './services/benefit.service';
import { BlockchainService } from './services/blockchain.service';
import { ChatService } from './services/chat.service';
import { ChatbotService } from './services/chatbot.service';
import { ClassService } from './services/class.service';
import { ClassPatternService } from './services/classPattern.service';
import { ContractService } from './services/contract.service';
import { FavoritePostService } from './services/favoritePost.service';
import { LessonService } from './services/lesson.service';
import { LessonPatternService } from './services/lessonPattern.service';
import { NotificationService } from './services/notification.service';
import { PaymentService } from './services/payment.service';
import { PostService } from './services/post.service';
import { RecommendService } from './services/recommend.service';
import { RequestService } from './services/request.service';
import { SubjectService } from './services/subject.service';
import { TimeSlotService } from './services/timeSlot.service';
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
      registerServices('USER', 'CONTRACT', 'EDUCATION', 'TRANSACTION')
    ),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ContractController,
    TutorController,
    UserProfileController,
    TimeSlotController,
    PostController,
    SubjectController,
    RequestController,
    ClassController,
    FavoritePostController,
    PaymentController,
    NotificationController,
    ChatController,
    ClassPatternController,
    LessonPatternController,
    BlockchainController,
    ViolateController,
    ChatbotController,
    RecommendController,
    LessonController,
    BenefitController,
  ],
  providers: [
    AuthService,
    UserService,
    ContractService,
    TutorService,
    UserProfileService,
    TimeSlotService,
    PostService,
    SubjectService,
    RequestService,
    ClassService,
    FavoritePostService,
    PaymentService,
    NotificationService,
    ChatService,
    ClassPatternService,
    LessonPatternService,
    BlockchainService,
    ViolateService,
    ChatbotService,
    ChatbotRepository,
    RecommendService,
    RecommendRepository,
    LessonService,
    BenefitService,
  ],
})
export class AppModule {}
