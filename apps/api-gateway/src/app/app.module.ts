import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { ContractController } from './controllers/contract.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { ContractService } from './services/contract.service';
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
  imports: [ClientsModule.register(registerServices('USER', 'CONTRACT'))],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ContractController,
  ],
  providers: [AuthService, UserService, ContractService],
})
export class AppModule {}
