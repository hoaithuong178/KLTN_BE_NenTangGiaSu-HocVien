import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BlockchainService } from './blockchain.service';

@Controller()
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @MessagePattern({ cmd: 'get_balance' })
  async getBalance(@Payload() address: string) {
    return this.blockchainService.getBalance(address);
  }

  @MessagePattern({ cmd: 'get_coin_price' })
  async getCoinPrice() {
    return this.blockchainService.getCoinPrice();
  }
}
