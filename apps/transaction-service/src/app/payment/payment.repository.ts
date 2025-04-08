import { PaymentStatus } from '.prisma/transaction-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayment } from '../types';

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

  async findById(id: string) {
    return this.prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  async createPayment(data: CreatePayment) {
    return this.prisma.payment.create({
      data: {
        id: data.id,
        fromId: data.fromId,
        toId: data.toId,
        docId: data.docId,
        amount: data.amount,
        amountEth: data.amountEth,
        fee: data.fee,
        feeEth: data.feeEth,
        type: data.type,
        status: data.status,
      },
    });
  }
}
