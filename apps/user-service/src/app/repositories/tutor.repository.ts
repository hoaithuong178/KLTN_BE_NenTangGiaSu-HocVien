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

  getTutorById(id: string) {
    return this.prismaService.tutorProfile.findUnique({
      where: {
        id,
      },
    });
  }

  updateTutor(id: string, data: Partial<Omit<CreateTutor, 'id'>>) {
    return this.prismaService.tutorProfile.update({
      where: {
        id,
      },
      data,
    });
  }

  async countBySpecializations() {
    const result = await this.prismaService.tutorProfile.groupBy({
      by: ['specializations'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Chuyển đổi kết quả thành định dạng phù hợp
    const flattenedResults = result.flatMap((item) =>
      item.specializations.map((specialization) => ({
        specialization,
        count: item._count.id,
      }))
    );

    // Gộp các kết quả trùng lặp
    const countMap = new Map<string, number>();
    flattenedResults.forEach((item) => {
      countMap.set(
        item.specialization,
        (countMap.get(item.specialization) || 0) + item.count
      );
    });

    return Array.from(countMap.entries()).map(([specialization, count]) => ({
      specialization,
      count,
    }));
  }
}
