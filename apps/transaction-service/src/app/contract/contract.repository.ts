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
}
