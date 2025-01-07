import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  Logger.log('Starting contract service...');

  const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

  if (!RABBIT_MQ_URL) {
    throw new Error('RABBIT_MQ_URL is not defined');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBIT_MQ_URL],
        queue: 'contract_queue',
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();
}

bootstrap();
