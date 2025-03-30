import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import { ContractModule } from './app/contract/contract.module';
import { HealthModule } from './app/health/health.module';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('TransactionService');

  logger.log('Starting transaction service...');

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
        queue: 'transaction_queue',
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();

  const contractApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    ContractModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBIT_MQ_URL],
        queue: 'blockchain_contract_queue',
        queueOptions: { durable: true },
        noAck: false,
      },
    }
  );

  await contractApp.listen();

  const httpApp = await NestFactory.create(HealthModule);
  const port = process.env.PORT || 4004;
  await httpApp.listen(port);
  logger.log(`HTTP server listening on port ${port}`);
}

bootstrap();
