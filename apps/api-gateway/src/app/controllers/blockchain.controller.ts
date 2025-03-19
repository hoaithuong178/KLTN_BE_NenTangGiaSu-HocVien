import { Controller, Get, Logger, Param } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    this.logger.log(`Getting balance for address: ${address}`);
    return this.blockchainService.getBalance(address);
  }
}
