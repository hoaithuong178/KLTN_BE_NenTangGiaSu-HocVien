import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FavoritePostService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly educationService: ClientProxy
  ) {}

  toggleFavoritePost(postId: string, userId: string) {
    return lastValueFrom(
      this.educationService.send(
        { cmd: 'toggle-favorite-post' },
        { postId, userId }
      )
    );
  }

  getFavoritePostsByUserId(userId: string) {
    return lastValueFrom(
      this.educationService.send({ cmd: 'get-favorite-posts' }, userId)
    );
  }
}
