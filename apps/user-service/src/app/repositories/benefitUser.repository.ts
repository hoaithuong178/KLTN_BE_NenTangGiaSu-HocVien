import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
