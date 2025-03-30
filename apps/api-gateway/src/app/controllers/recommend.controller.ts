import { Role } from '.prisma/user-service';
import { AuthRequest } from '@be/shared';
import {
  Controller,
  Get,
  Logger,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { RecommendService } from '../services/recommend.service';
import {
  IRecommendPostForStudentRequest,
  IRecommendTutorForStudentRequest,
} from '../types';

@Controller('recommend')
export class RecommendController {
  private readonly logger: Logger = new Logger(RecommendController.name);

  constructor(private readonly recommendService: RecommendService) {}

  @Get('tutor-for-student')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT])
  async getConversation(
    @Request() req: AuthRequest,
    @Query() query: IRecommendTutorForStudentRequest
  ) {
    this.logger.log(`Get conversation: ${req.user.id}`);

    return await this.recommendService.recommendTutorForStudent({
      userId: req.user.id,
      top_n: query.top_n ?? 10,
      min_score: query.min_score ?? 0.5,
    });
  }

  @Get('post-for-student')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT])
  async getPostForStudent(
    @Request() req: AuthRequest,
    @Query() query: IRecommendPostForStudentRequest
  ) {
    this.logger.log(`Get post for student: ${req.user.id}`);

    return await this.recommendService.recommendPostForStudent({
      userId: req.user.id,
      limit: query.limit ?? 10,
      min_score: query.min_score ?? 0.5,
    });
  }

  @Get('post-for-tutor')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async getPostForTutor(
    @Request() req: AuthRequest,
    @Query() query: IRecommendPostForStudentRequest
  ) {
    this.logger.log(`Get post for tutor: ${req.user.id}`);

    return await this.recommendService.recommendPostForTutor({
      userId: req.user.id,
      limit: query.limit ?? 10,
      min_score: query.min_score ?? 0.5,
    });
  }

  @Get('tutor-for-tutor')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async getTutorForTutor(
    @Request() req: AuthRequest,
    @Query() query: IRecommendTutorForStudentRequest
  ) {
    this.logger.log(`Get tutor for tutor: ${req.user.id}`);

    return await this.recommendService.recommendTutorForTutor({
      userId: req.user.id,
      top_n: query.top_n ?? 10,
      min_score: query.min_score ?? 0.5,
    });
  }
}
