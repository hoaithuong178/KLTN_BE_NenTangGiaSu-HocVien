import { Post } from '.prisma/education-service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Post) {
    return this.prismaService.post.create({
      data: {
        ...data,
        postTime: new Date(data.postTime),
        schedule: data.schedule.map((s) => ({
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        })),
        user: {
          set: data.user,
        },
      },
    });
  }

  findAll() {
    return this.prismaService.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  update(id: string, { user, ...data }: Partial<Post>) {
    return this.prismaService.post.update({
      where: {
        id,
        user: {
          is: {
            id: user.id,
          },
        },
      },
      data: {
        ...data,
        postTime: data.postTime ? new Date(data.postTime) : undefined,
        schedule: data.schedule?.map((s) => ({
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        })),
      },
    });
  }

  delete(id: string) {
    return this.prismaService.post.delete({
      where: { id },
    });
  }

  deleteByUser(postId: string, userId: string) {
    return this.prismaService.post.delete({
      where: {
        id: postId,
        user: {
          is: {
            id: userId,
          },
        },
      },
    });
  }
}
