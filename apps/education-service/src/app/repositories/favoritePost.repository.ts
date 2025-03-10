import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritePostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(postId: string, userId: string) {
    return this.prismaService.favoritePost.create({
      data: {
        postId,
        userId,
      },
    });
  }

  findByUserId(userId: string) {
    return this.prismaService.favoritePost.findMany({
      where: {
        userId,
      },
    });
  }

  findByPostIdAndUserId(postId: string, userId: string) {
    return this.prismaService.favoritePost.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }

  delete(postId: string, userId: string) {
    return this.prismaService.favoritePost.deleteMany({
      where: {
        postId,
        userId,
      },
    });
  }
}
