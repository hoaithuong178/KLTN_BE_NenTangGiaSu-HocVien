import { Post } from '.prisma/education-service';
import { DeletePostRequest, PostSearchRequest } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern({ cmd: 'create-post' })
  create(data: Post) {
    return this.postService.create(data);
  }

  @MessagePattern({ cmd: 'get-all-approved-posts' })
  findAll() {
    return this.postService.findAllApproved();
  }

  @MessagePattern({ cmd: 'get-post-by-id' })
  findById(id: string) {
    return this.postService.findById(id);
  }

  @MessagePattern({ cmd: 'update-post' })
  update(data: { id: string; data: Partial<Post> }) {
    return this.postService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-post' })
  delete(data: DeletePostRequest) {
    return this.postService.delete(data);
  }

  @MessagePattern({ cmd: 'search-posts' })
  search(searchRequest: PostSearchRequest) {
    return this.postService.search(searchRequest);
  }
}
