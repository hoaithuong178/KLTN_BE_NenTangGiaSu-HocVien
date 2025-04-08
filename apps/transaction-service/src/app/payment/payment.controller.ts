import { PaymentStatus, PaymentType } from '.prisma/transaction-service';
import { BenefitPackagePurchasedEvent, ExistedError } from '@be/shared';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'get_pending_payments' })
  async getPendingPayments(@Payload() data: { id: string }) {
    return this.paymentService.getPendingPayments(data.id);
  }

  @MessagePattern({ cmd: 'get_processed_payments' })
  async getProcessedPayments(@Payload() data: { id: string }) {
    return this.paymentService.getProcessedPayments(data.id);
  }

  @EventPattern('benefit.purchased')
  async handleBenefitPurchased(
    @Payload() event: BenefitPackagePurchasedEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Payment Controller nhận được sự kiện benefit purchased: ${JSON.stringify(
          event
        )}`
      );

      const payment = await this.paymentService.findById(event.id);

      if (payment) {
        throw new ExistedError('Thanh toán đã tồn tại');
      }

      const amount = event.amount * event.priceRate;

      await this.paymentService.createPayment({
        id: event.id,
        type: PaymentType.BENEFIT,
        status: PaymentStatus.SUCCESS,
        amount,
        amountEth: event.amount,
        docId: event.id,
        fromId: event.userId,
      });

      channel.ack(originalMsg);
      return event;
    } catch (error) {
      this.logger.error(
        'Payment Controller - Lỗi khi xử lý benefit purchased event:',
        error
      );

      if (error instanceof ExistedError) channel.ack(originalMsg);
      else channel.nack(originalMsg, false, true);

      throw error;
    }
  }
}
