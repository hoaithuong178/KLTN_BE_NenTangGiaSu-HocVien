import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FavoritePostService } from '../services/favoritePost.service';

@Controller('favorite-posts')
export class FavoritePostController {
  constructor(private readonly favoritePostService: FavoritePostService) {}

  @MessagePattern({ cmd: 'toggle-favorite-post' })
  toggleFavoritePost(data: { postId: string; userId: string }) {
    return this.favoritePostService.toggleFavoritePost(
      data.postId,
      data.userId
    );
  }

  @MessagePattern({ cmd: 'get-favorite-posts' })
  getFavoritePostsByUserId(userId: string) {
    return this.favoritePostService.getFavoritePostsByUserId(userId);
  }
}
