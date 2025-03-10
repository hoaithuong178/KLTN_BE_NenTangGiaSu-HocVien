import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'get_pending_payments' })
  async getPendingPayments(@Payload() data: { id: string }) {
    return this.paymentService.getPendingPayments(data.id);
  }

  @MessagePattern({ cmd: 'get_processed_payments' })
  async getProcessedPayments(@Payload() data: { id: string }) {
    return this.paymentService.getProcessedPayments(data.id);
  }
}
