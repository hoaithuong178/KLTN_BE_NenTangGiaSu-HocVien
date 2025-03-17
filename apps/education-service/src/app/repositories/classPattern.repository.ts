import { ClassPattern, Grade } from '.prisma/education-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassPatternRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: { tutorId: string; grade: Grade; subject: string }) {
    return this.prismaService.classPattern.create({
      data,
      include: {
        lessons: true,
        tutor: true,
      },
    });
  }

  findAll() {
    return this.prismaService.classPattern.findMany({
      include: {
        lessons: true,
        tutor: true,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.classPattern.findUnique({
      where: { id },
      include: {
        lessons: true,
        tutor: true,
      },
    });
  }

  findByTutorId(tutorId: string) {
    return this.prismaService.classPattern.findMany({
      where: { tutorId },
      include: {
        lessons: true,
        tutor: true,
      },
    });
  }

  update(id: string, data: Partial<ClassPattern>) {
    return this.prismaService.classPattern.update({
      where: { id },
      data,
      include: {
        lessons: true,
        tutor: true,
      },
    });
  }

  delete(id: string) {
    return this.prismaService.classPattern.delete({
      where: { id },
    });
  }
}
