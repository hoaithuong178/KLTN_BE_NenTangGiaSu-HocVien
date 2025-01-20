import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeSlotController } from './controllers/timeSlot.controller';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TimeSlotRepository } from './repositories/timeSlot.repository';
import { UserRepository } from './repositories/user.repository';
import { TimeSlotService } from './services/timeSlot.service';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, UserController, TimeSlotController],
  providers: [
    AppService,
    UserService,
    UserRepository,
    TimeSlotService,
    TimeSlotRepository,
  ],
})
export class AppModule {}
