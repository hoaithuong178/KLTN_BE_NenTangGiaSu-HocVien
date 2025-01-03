import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

  if (!RABBIT_MQ_URL) {
    throw new Error('RABBIT_MQ_URL is not defined');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBIT_MQ_URL], // RabbitMQ URL
      queue: 'api_gateway_queue', // Name of the queue
      queueOptions: {
        durable: false,
      },
    },
  });

  const PORT = process.env.PORT || 4000;

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();
  await app.listen(PORT);
  Logger.log(`API Gateway is running on http://localhost:${PORT}`);
}

bootstrap();
