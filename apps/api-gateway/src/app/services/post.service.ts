import { CreatePost, DeletePostRequest, PostSearchRequest } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly postService: ClientProxy
  ) {}

  createPost(data: CreatePost) {
    return lastValueFrom(this.postService.send({ cmd: 'create-post' }, data));
  }

  getAllPosts() {
    return lastValueFrom(
      this.postService.send({ cmd: 'get-all-approved-posts' }, {})
    );
  }

  getPostById(id: string) {
    return lastValueFrom(this.postService.send({ cmd: 'get-post-by-id' }, id));
  }

  updatePost(id: string, data: Partial<CreatePost>) {
    return lastValueFrom(
      this.postService.send({ cmd: 'update-post' }, { id, data })
    );
  }

  deletePost(data: DeletePostRequest) {
    return lastValueFrom(this.postService.send({ cmd: 'delete-post' }, data));
  }

  searchPosts(searchRequest: PostSearchRequest) {
    return lastValueFrom(
      this.postService.send({ cmd: 'search-posts' }, searchRequest)
    );
  }

  approvePost(id: string) {
    return lastValueFrom(this.postService.send({ cmd: 'approve-post' }, id));
  }

  rejectPost(id: string, reason: string) {
    return lastValueFrom(
      this.postService.send({ cmd: 'reject-post' }, { id, reason })
    );
  }
}
