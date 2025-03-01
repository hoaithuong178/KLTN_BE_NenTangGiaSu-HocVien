import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostController } from './controllers/post.controller';
import { SubjectController } from './controllers/subject.controller';
import { TimeSlotController } from './controllers/timeSlot.controller';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PostRepository } from './repositories/post.repository';
import { SubjectRepository } from './repositories/subject.repository';
import { TimeSlotRepository } from './repositories/timeSlot.repository';
import { UserRepository } from './repositories/user.repository';
import { PostService } from './services/post.service';
import { SubjectService } from './services/subject.service';
import { TimeSlotService } from './services/timeSlot.service';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    UserController,
    TimeSlotController,
    PostController,
    SubjectController,
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
  ],
})
export class AppModule {}
