import { PaymentStatus } from '.prisma/transaction-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingPayments(id: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [{ fromId: id }, { toId: id }, { docId: id }],
        status: PaymentStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findProcessedPayments(id: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [{ fromId: id }, { toId: id }, { docId: id }],
        status: {
          in: [PaymentStatus.SUCCESS, PaymentStatus.FAILED],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
