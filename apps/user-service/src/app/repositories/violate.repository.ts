import { Violate } from '.prisma/user-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ViolateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    reason: string;
    violate: number;
  }): Promise<Violate> {
    return this.prisma.violate.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Violate[]> {
    return this.prisma.violate.findMany({
      where: { userId },
    });
  }

  async findById(id: string): Promise<Violate | null> {
    return this.prisma.violate.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<Violate>): Promise<Violate> {
    return this.prisma.violate.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Violate> {
    return this.prisma.violate.delete({
      where: { id },
    });
  }
}
