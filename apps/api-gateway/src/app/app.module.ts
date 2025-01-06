import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

if (!RABBIT_MQ_URL) {
  throw new Error('RABBIT_MQ_URL is not defined');
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // Unique name for the microservice
        transport: Transport.RMQ,
        options: {
          urls: [RABBIT_MQ_URL], // RabbitMQ URL
          queue: 'user_queue', // Queue name
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AppModule {}
