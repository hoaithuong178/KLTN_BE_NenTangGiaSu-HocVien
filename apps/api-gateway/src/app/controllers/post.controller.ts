import { Role } from '.prisma/user-service';
import { AuthRequest, CreatePostRequest, PostSearchRequest } from '@be/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Controller('posts')
export class PostController {
  private readonly logger: Logger = new Logger(PostController.name);

  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT])
  async createPost(
    @Request() req: AuthRequest,
    @Body() data: CreatePostRequest
  ) {
    this.logger.log(
      `Create post for user ${req.user.id} with data ${JSON.stringify(data)}`
    );

    const user = await this.userService.getUserById(req.user.id);

    return this.postService.createPost({
      ...data,
      user: {
        id: user.data.id,
        name: user.data.name,
        avatar: user.data.avatar || '',
      },
    });
  }

  @Get()
  async getAllPosts() {
    this.logger.log('Get all posts');
    return this.postService.getAllPosts();
  }

  @Get('search')
  async searchPosts(@Query() searchRequest: PostSearchRequest) {
    this.logger.log(`Search posts with data ${JSON.stringify(searchRequest)}`);
    return this.postService.searchPosts(searchRequest);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    this.logger.log(`Get post by id ${id}`);
    return this.postService.getPostById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.ADMIN])
  async updatePost(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() data: Partial<CreatePostRequest>
  ) {
    this.logger.log(`Update post ${id} with data ${JSON.stringify(data)}`);

    return this.postService.updatePost(id, {
      ...data,
      user: {
        id: req.user.id,
        name: '',
        avatar: '',
      },
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.ADMIN])
  async deletePost(@Param('id') id: string, @Request() req: AuthRequest) {
    this.logger.log(`Delete post ${id}`);
    return this.postService.deletePost({
      postId: id,
      userId: req.user.id,
      role: req.user.role as Role,
    });
  }
}
