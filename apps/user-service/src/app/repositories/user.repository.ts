import { UserStatus } from '.prisma/user-service';
import { CreateUser, CreateUserWithGoogle } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(data: CreateUser) {
    return this.prismaService.user.create({ data });
  }

  findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  findUserByPhone(phone: string) {
    return this.prismaService.user.findFirst({
      where: { phone },
    });
  }

  findUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        userProfiles: {
          select: {
            avatar: true,
          },
        },
      },
    });
  }

  login(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  getFullInfo(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
        tutorProfiles: {
          some: {},
        },
      },
      include: {
        userProfiles: true,
        tutorProfiles: true,
      },
    });
  }

  getUsersForAdmin() {
    return this.prismaService.user.findMany({
      include: {
        userProfiles: true,
      },
    });
  }

  updateUserStatus(id: string, status: UserStatus) {
    return this.prismaService.user.update({
      where: { id },
      data: { status },
    });
  }

  updateOnlineStatus(id: string, isOnline: boolean) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        isOnline,
        lastActive: new Date(),
      },
    });
  }

  createWithGoogle(data: CreateUserWithGoogle) {
    return this.prismaService.user.create({ data });
  }
}
