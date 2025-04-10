import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import { HealthModule } from './app/health/health.module';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('EducationService');

  logger.log('Starting education service...');

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
        queue: 'education_queue',
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();

  const classApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBIT_MQ_URL],
        queue: 'blockchain_class_queue',
        queueOptions: { durable: true },
        noAck: false,
      },
    }
  );

  await classApp.listen();

  const httpApp = await NestFactory.create(HealthModule);
  const port = process.env.PORT || 4003;
  await httpApp.listen(port);
  logger.log(`HTTP server listening on port ${port}`);
}

bootstrap();
