import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FavoritePostRepository } from '../repositories/favoritePost.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class FavoritePostService {
  private readonly logger = new Logger(FavoritePostService.name);

  constructor(
    private readonly favoritePostRepository: FavoritePostRepository,
    private readonly postRepository: PostRepository
  ) {}

  async toggleFavoritePost(postId: string, userId: string) {
    this.logger.log(`Toggling favorite post ${postId} for user ${userId}`);

    const [existingFavorite, post] = await Promise.all([
      this.favoritePostRepository.findByPostIdAndUserId(postId, userId),
      this.postRepository.findById(postId),
    ]);

    if (!post) {
      throw new RpcException({
        statusCode: 404,
        message: 'Bài viết không tồn tại',
      });
    }

    if (existingFavorite) {
      await this.favoritePostRepository.delete(postId, userId);
      return {
        statusCode: 200,
        data: false,
      };
    }

    await this.favoritePostRepository.create(postId, userId);
    return {
      statusCode: 201,
      data: true,
    };
  }

  async getFavoritePostsByUserId(userId: string) {
    this.logger.log(`Getting favorite posts for user ${userId}`);

    const favoritePosts = await this.favoritePostRepository.findByUserId(
      userId
    );

    const posts = await this.postRepository.findByIds(
      favoritePosts.map((post) => post.postId)
    );

    return {
      statusCode: 200,
      data: posts,
    };
  }
}
