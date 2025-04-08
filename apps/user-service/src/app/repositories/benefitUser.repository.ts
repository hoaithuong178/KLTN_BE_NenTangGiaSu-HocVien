import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBenefitUser } from '../types';

@Injectable()
export class BenefitUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  connectUser(fromUserId: string, toUserId: string) {
    return this.prisma.benefitUser.update({
      where: {
        userId: fromUserId,
      },
      data: {
        connectedUserIds: {
          push: toUserId,
        },
        remaining: {
          decrement: 1,
        },
      },
    });
  }

  getUserBenefit(userId: string) {
    return this.prisma.benefitUser.findUnique({
      where: {
        userId,
      },
    });
  }

  upsertBenefitUser(data: CreateBenefitUser) {
    return this.prisma.benefitUser.upsert({
      where: {
        userId: data.userId,
      },
      update: {
        remaining: {
          increment: data.remaining,
        },
        eventIds: {
          push: data.eventId,
        },
      },
      create: {
        userId: data.userId,
        remaining: data.remaining,
        eventIds: [data.eventId],
      },
    });
  }

  findByEventId(eventId: string) {
    return this.prisma.benefitUser.findFirst({
      where: {
        eventIds: { has: eventId },
      },
    });
  }
}
