import { Post } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { DeletePostRequest } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PostRepository } from '../repositories/post.repository';
import { SubjectRepository } from '../repositories/subject.repository';

@Injectable()
export class PostService {
  private readonly logger: Logger = new Logger(PostService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly subjectRepository: SubjectRepository
  ) {}

  async create(data: Post) {
    this.logger.log('Creating post with data: ' + JSON.stringify(data));

    const subject = await this.subjectRepository.findById(String(data.subject));

    if (!subject) {
      throw new RpcException('Subject not found');
    }

    return this.postRepository.create({
      ...data,
      subject,
    });
  }

  findAll() {
    this.logger.log('Getting all posts');
    return this.postRepository.findAll();
  }

  findById(id: string) {
    this.logger.log('Getting post by ID: ' + id);
    return this.postRepository.findById(id);
  }

  update(id: string, data: Partial<Post>) {
    this.logger.log('Updating post with data: ' + JSON.stringify(data));
    return this.postRepository.update(id, data);
  }

  delete(data: DeletePostRequest) {
    this.logger.log('Deleting post with data: ' + data);
    if (data.role === Role.ADMIN)
      return this.postRepository.delete(data.postId);

    return this.postRepository.deleteByUser(data.postId, data.userId);
  }
}
