import { Payment } from '.prisma/transaction-service';
import { BaseResponse } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async getPendingPayments(id: string) {
    const payments = await this.paymentRepository.findPendingPayments(id);

    const response: BaseResponse<Payment[]> = {
      data: payments,
      statusCode: 200,
    };

    return response;
  }

  async getProcessedPayments(id: string) {
    const payments = await this.paymentRepository.findProcessedPayments(id);

    const response: BaseResponse<Payment[]> = {
      data: payments,
      statusCode: 200,
    };

    return response;
  }
}
