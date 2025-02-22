import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import elasticClient from './app/configs/elastic.config';
import Redis from './app/configs/redis.config';
import { TUTOR_INDEX } from './app/constants/elasticsearch.const';
import { HealthModule } from './app/health/health.module';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('UserService');

  logger.log('Starting user service...');

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
        queue: 'user_queue',
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();

  await Redis.getInstance().getClient().connect();
  logger.log('Connected to Redis');

  setInterval(() => {
    Redis.getInstance().getClient().get('123');
  }, 300000);

  await elasticClient.info();
  logger.log('Connected to ElasticSearch');

  try {
    if (!(await elasticClient.indices.exists({ index: TUTOR_INDEX }))) {
      await elasticClient.indices.create({
        index: TUTOR_INDEX,
      });
    }
  } catch (error) {
    logger.error(error);
  }

  const httpApp = await NestFactory.create(HealthModule);
  const port = process.env.PORT || 4001;
  await httpApp.listen(port);
  logger.log(`HTTP server listening on port ${port}`);
}

bootstrap();
