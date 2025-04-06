import { CreateBenefitDto, UpdateBenefitDto } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BenefitRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateBenefitDto) {
    return this.prismaService.benefit.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.benefit.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.benefit.findUnique({
      where: { id, isDeleted: false },
    });
  }

  update(id: string, data: UpdateBenefitDto) {
    return this.prismaService.benefit.update({
      where: { id, isDeleted: false },
      data,
    });
  }

  delete(id: string) {
    return this.prismaService.benefit.delete({ where: { id } });
  }

  updateStatus(id: string, status: boolean) {
    return this.prismaService.benefit.update({
      where: { id },
      data: { isDeleted: status },
    });
  }
}
