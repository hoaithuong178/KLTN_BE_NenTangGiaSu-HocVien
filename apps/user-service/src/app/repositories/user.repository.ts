import { UserStatus } from '.prisma/user-service';
import { CreateUser } from '@be/shared';
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
    return this.prismaService.user.findUnique({
      where: { phone },
    });
  }

  findUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
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
}
