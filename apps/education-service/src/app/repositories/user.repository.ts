import { User } from '.prisma/education-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(data: User) {
    return this.prismaService.user.create({ data });
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
