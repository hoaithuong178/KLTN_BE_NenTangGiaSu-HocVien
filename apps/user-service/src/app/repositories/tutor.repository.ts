import { CreateTutor } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createTutor({ id, taughtStudentsCount, ...data }: CreateTutor) {
    return this.prismaService.tutorProfile.create({
      data: {
        ...data,
        taughtStudentsCount: taughtStudentsCount || 0,
        rating: 0,
        user: {
          connect: {
            id,
          },
        },
      },
    });
  }
}
