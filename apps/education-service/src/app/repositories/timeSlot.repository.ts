import { CreateTimeSlot } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeSlotRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createTimeSlots(data: CreateTimeSlot[]) {
    return this.prismaService.timeSlot.createMany({
      data: data.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      })),
    });
  }

  getTimeSlotsByUserId(userId: string) {
    return this.prismaService.timeSlot.findMany({
      where: {
        userId,
      },
    });
  }
}
