import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { TutorController } from './controllers/tutor.controller';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/userProfile.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TutorRepository } from './repositories/tutor.repository';
import { UserRepository } from './repositories/user.repository';
import { UserProfileRepository } from './repositories/userProfile.repository';
import { AuthService } from './services/auth.service';
import { TutorService } from './services/tutor.service';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/userProfile.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TutorController,
    UserProfileController,
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
  ],
})
export class AppModule {}
