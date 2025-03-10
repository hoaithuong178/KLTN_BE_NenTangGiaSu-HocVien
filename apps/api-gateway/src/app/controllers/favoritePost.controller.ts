import { AuthRequest } from '@be/shared';
import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { FavoritePostService } from '../services/favoritePost.service';

@Controller('favorite-posts')
export class FavoritePostController {
  private readonly logger = new Logger(FavoritePostController.name);

  constructor(private readonly favoritePostService: FavoritePostService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  async toggleFavoritePost(
    @Param('postId') postId: string,
    @Request() req: AuthRequest
  ) {
    this.logger.log(`Toggling favorite post ${postId} for user ${req.user.id}`);

    return this.favoritePostService.toggleFavoritePost(postId, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getFavoritePostsByUserId(@Request() req: AuthRequest) {
    this.logger.log(`Getting favorite posts for user ${req.user.id}`);

    return this.favoritePostService.getFavoritePostsByUserId(req.user.id);
  }
}
