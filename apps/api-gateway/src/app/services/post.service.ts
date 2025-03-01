import { CreatePost, DeletePostRequest, PostSearchRequest } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly postService: ClientProxy
  ) {}

  createPost(data: CreatePost) {
    return this.postService.send({ cmd: 'create-post' }, data).toPromise();
  }

  getAllPosts() {
    return this.postService.send({ cmd: 'get-all-posts' }, {}).toPromise();
  }

  getPostById(id: string) {
    return this.postService.send({ cmd: 'get-post-by-id' }, id).toPromise();
  }

  updatePost(id: string, data: Partial<CreatePost>) {
    return this.postService
      .send({ cmd: 'update-post' }, { id, data })
      .toPromise();
  }

  deletePost(data: DeletePostRequest) {
    return this.postService.send({ cmd: 'delete-post' }, data).toPromise();
  }

  searchPosts(searchRequest: PostSearchRequest) {
    return this.postService
      .send({ cmd: 'search-posts' }, searchRequest)
      .toPromise();
  }
}
