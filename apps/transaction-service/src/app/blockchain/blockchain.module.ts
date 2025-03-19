import { Module } from '@nestjs/common';
import { BlockchainController } from './blockchain.controller';
import { BlockchainRepository } from './blockchain.repository';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [],
  controllers: [BlockchainController],
  providers: [BlockchainService, BlockchainRepository],
})
export class BlockchainModule {}
