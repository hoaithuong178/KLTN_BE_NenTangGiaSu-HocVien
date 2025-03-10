import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  private readonly logger: Logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Get('pending/:id')
  @UseGuards(AuthGuard)
  async getPendingPayments(@Param('id') id: string) {
    this.logger.log(
      `Nhận yêu cầu lấy các khoản thanh toán đang chờ xử lý cho id ${id}`
    );

    return await this.paymentService.getPendingPayments(id);
  }

  @Get('processed/:id')
  @UseGuards(AuthGuard)
  async getProcessedPayments(@Param('id') id: string) {
    this.logger.log(
      `Nhận yêu cầu lấy các khoản thanh toán đã xử lý cho id ${id}`
    );

    return await this.paymentService.getProcessedPayments(id);
  }
}
