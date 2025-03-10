import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { PaymentService } from './payment.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
