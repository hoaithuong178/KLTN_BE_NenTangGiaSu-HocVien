import { Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { BlockchainController } from './blockchain.controller';
import { BlockchainRepository } from './blockchain.repository';
import { BlockchainService } from './blockchain.service';

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
      queueOptions: {
        durable: true, // Thay đổi từ false thành true
      },
      persistent: true,
    },
  }));
};

@Module({
  imports: [
    ClientsModule.register(
      registerServices(
        'BLOCKCHAIN_CONTRACT',
        'BLOCKCHAIN_CLASS',
        'BLOCKCHAIN_USER'
      )
    ),
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService, BlockchainRepository],
})
export class BlockchainModule {}
