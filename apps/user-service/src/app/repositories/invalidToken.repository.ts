import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logout } from '@be/shared';

@Injectable()
export class InvalidTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createInvalidToken(data: Logout) {
    return this.prismaService.invalidToken.create({
      data: {
        expiredAt: data.expiredAt,
        id: data.id,
      },
    });
  }

  getInvalidToken(id: string) {
    return this.prismaService.invalidToken.findUnique({
      where: { id },
    });
  }

  deleteExpiredInvalidTokens() {
    return this.prismaService.invalidToken.deleteMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
      },
    });
  }
}
