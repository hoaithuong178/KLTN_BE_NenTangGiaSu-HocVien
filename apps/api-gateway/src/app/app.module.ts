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
import { ContractController } from './controllers/contract.controller';
import { TutorController } from './controllers/tutor.controller';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/userProfile.controller';
import { AuthService } from './services/auth.service';
import { ContractService } from './services/contract.service';
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
    ClientsModule.register(registerServices('USER', 'CONTRACT')),
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
  ],
  providers: [
    AuthService,
    UserService,
    ContractService,
    TutorService,
    UserProfileService,
  ],
})
export class AppModule {}
