import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy
  ) {}

  getPendingPayments(id: string) {
    return lastValueFrom(
      this.transactionService.send({ cmd: 'get_pending_payments' }, id)
    );
  }

  getProcessedPayments(id: string) {
    return lastValueFrom(
      this.transactionService.send({ cmd: 'get_processed_payments' }, id)
    );
  }
}
