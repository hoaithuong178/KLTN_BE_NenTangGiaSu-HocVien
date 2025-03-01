import { Subject } from '.prisma/education-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Subject) {
    return this.prismaService.subject.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(id: string) {
    return this.prismaService.subject.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Partial<Subject>) {
    return this.prismaService.subject.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prismaService.subject.delete({
      where: { id },
    });
  }
}
