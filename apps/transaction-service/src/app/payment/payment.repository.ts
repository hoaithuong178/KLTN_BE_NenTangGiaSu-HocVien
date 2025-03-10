import { PaymentStatus } from '.prisma/transaction-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingPayments(id: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [{ studentId: id }, { tutorId: id }, { contractId: id }],
        status: PaymentStatus.PENDING,
      },
      include: {
        contract: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findProcessedPayments(id: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [{ studentId: id }, { tutorId: id }, { contractId: id }],
        status: {
          in: [PaymentStatus.SUCCESS, PaymentStatus.FAILED],
        },
      },
      include: {
        contract: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
