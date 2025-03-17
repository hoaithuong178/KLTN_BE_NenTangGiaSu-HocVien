import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassController } from './controllers/class.controller';
import { ClassPatternController } from './controllers/classPattern.controller';
import { FavoritePostController } from './controllers/favoritePost.controller';
import { LessonPatternController } from './controllers/lessonPattern.controller';
import { PostController } from './controllers/post.controller';
import { RequestController } from './controllers/request.controller';
import { SubjectController } from './controllers/subject.controller';
import { TimeSlotController } from './controllers/timeSlot.controller';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClassRepository } from './repositories/class.repository';
import { ClassPatternRepository } from './repositories/classPattern.repository';
import { FavoritePostRepository } from './repositories/favoritePost.repository';
import { LessonPatternRepository } from './repositories/lessonPattern.repository';
import { PostRepository } from './repositories/post.repository';
import { RequestRepository } from './repositories/request.repository';
import { SubjectRepository } from './repositories/subject.repository';
import { TimeSlotRepository } from './repositories/timeSlot.repository';
import { UserRepository } from './repositories/user.repository';
import { ClassService } from './services/class.service';
import { ClassPatternService } from './services/classPattern.service';
import { FavoritePostService } from './services/favoritePost.service';
import { LessonPatternService } from './services/lessonPattern.service';
import { PostService } from './services/post.service';
import { RequestService } from './services/request.service';
import { SubjectService } from './services/subject.service';
import { TimeSlotService } from './services/timeSlot.service';
import { UserService } from './services/user.service';

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
    ClientsModule.register(registerServices('CHATBOT_EDUCATION', 'USER')),
    PrismaModule,
  ],
  controllers: [
    AppController,
    UserController,
    TimeSlotController,
    PostController,
    SubjectController,
    RequestController,
    ClassController,
    FavoritePostController,
    ClassPatternController,
    LessonPatternController,
  ],
  providers: [
    AppService,
    UserService,
    UserRepository,
    TimeSlotService,
    TimeSlotRepository,
    PostService,
    PostRepository,
    SubjectService,
    SubjectRepository,
    RequestService,
    RequestRepository,
    ClassService,
    ClassRepository,
    FavoritePostService,
    FavoritePostRepository,
    ClassPatternService,
    ClassPatternRepository,
    LessonPatternService,
    LessonPatternRepository,
  ],
})
export class AppModule {
  constructor(private readonly postService: PostService) {}

  async onModuleInit() {
    await this.postService.syncPostsToElasticsearch();
  }
}
