import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy
  ) {}

  getBalance(address: string) {
    return lastValueFrom(
      this.transactionService.send({ cmd: 'get_balance' }, address)
    );
  }
}
