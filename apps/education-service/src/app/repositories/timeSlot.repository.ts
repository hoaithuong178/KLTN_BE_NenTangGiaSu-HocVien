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
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  updateTimeSlot(id: string, { userId, ...data }: CreateTimeSlot) {
    return this.prismaService.timeSlot.update({
      where: {
        id,
        userId,
      },
      data: {
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  deleteTimeSlot(id: string, userId: string) {
    return this.prismaService.timeSlot.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
