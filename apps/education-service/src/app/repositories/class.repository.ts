import { Class, ClassStatus } from '.prisma/education-service';
import { UpdateClassRequest } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Class) {
    return this.prismaService.class.create({
      data: {
        ...data,
      },
      include: {
        student: true,
        tutor: true,
        lessons: true,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.class.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: true,
        lessons: true,
        ratings: true,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prismaService.class.findMany({
      where: {
        OR: [{ studentId: userId }, { tutorId: userId }],
      },
      include: {
        student: true,
        tutor: true,
        lessons: true,
      },
    });
  }

  update(id: string, data: UpdateClassRequest) {
    return this.prismaService.class.update({
      where: { id },
      data: {
        ...data,
        status: ClassStatus.PENDING,
      },
      include: {
        student: true,
        tutor: true,
        lessons: true,
      },
    });
  }

  delete(id: string, userId: string) {
    return this.prismaService.class.delete({
      where: { id, OR: [{ studentId: userId }, { tutorId: userId }] },
    });
  }
}
