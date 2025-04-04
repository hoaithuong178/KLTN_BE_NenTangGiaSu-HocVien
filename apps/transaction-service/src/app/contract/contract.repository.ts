import { CreateContract } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  createContract(data: CreateContract) {
    return this.prisma.contract.create({
      data: {
        ...data,
        endDateActual: data.endDate,
      },
    });
  }

  findById(id: string) {
    return this.prisma.contract.findUnique({
      where: {
        id,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.contract.findMany({
      where: {
        OR: [{ studentId: userId }, { tutorId: userId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getAllContracts() {
    return this.prisma.contract.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
