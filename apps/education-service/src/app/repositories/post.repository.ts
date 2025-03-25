import { Post, PostStatus } from '.prisma/education-service';
import { UserBase } from '@be/shared';
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

  findAllApproved() {
    return this.prismaService.post.findMany({
      where: { status: PostStatus.APPROVED },
    });
  }

  findById(id: string) {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  findByIds(ids: string[]) {
    return this.prismaService.post.findMany({
      where: { id: { in: ids } },
    });
  }

  update(id: string, data: Partial<Post>) {
    return this.prismaService.post.update({
      where: { id },
      data: {
        ...data,
        postTime: data.postTime ? new Date(data.postTime) : undefined,
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

  updateUser({ id, avatar, name }: UserBase) {
    return this.prismaService.post.updateMany({
      where: {
        user: {
          is: {
            id,
          },
        },
      },
      data: {
        user: {
          update: {
            ...(name && { name }),
            ...(avatar && { avatar }),
          },
        },
      },
    });
  }
}
