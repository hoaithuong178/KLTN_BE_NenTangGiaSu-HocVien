import { LessonStatus } from '.prisma/education-service';
import { CreateLesson, UpdateLesson } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateLesson) {
    return this.prismaService.lesson.create({
      data,
      include: {
        class: true,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.lesson.findUnique({
      where: { id },
      include: {
        class: true,
      },
    });
  }

  findByClassId(classId: string) {
    return this.prismaService.lesson.findMany({
      where: { classId },
    });
  }

  update(id: string, data: UpdateLesson) {
    return this.prismaService.lesson.update({
      where: { id },
      data,
      include: {
        class: true,
      },
    });
  }

  updateStatus(id: string, status: LessonStatus) {
    return this.prismaService.lesson.update({
      where: { id },
      data: { status },
      include: {
        class: true,
      },
    });
  }

  delete(id: string) {
    return this.prismaService.lesson.delete({
      where: { id },
    });
  }
}
