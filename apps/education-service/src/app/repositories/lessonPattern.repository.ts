import { LessonPattern } from '.prisma/education-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonPatternRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Omit<LessonPattern, 'id'>) {
    return this.prismaService.lessonPattern.create({
      data,
      include: {
        class: true,
      },
    });
  }

  createMany(data: Omit<LessonPattern, 'id'>[]) {
    return this.prismaService.lessonPattern.createMany({
      data,
    });
  }

  findByClassId(classId: string) {
    return this.prismaService.lessonPattern.findMany({
      where: { classId },
      include: {
        class: true,
      },
    });
  }

  update(id: string, data: Partial<LessonPattern>) {
    return this.prismaService.lessonPattern.update({
      where: { id },
      data,
      include: {
        class: true,
      },
    });
  }

  delete(id: string) {
    return this.prismaService.lessonPattern.delete({
      where: { id },
    });
  }

  deleteByClassId(classId: string) {
    return this.prismaService.lessonPattern.deleteMany({
      where: { classId },
    });
  }
}
