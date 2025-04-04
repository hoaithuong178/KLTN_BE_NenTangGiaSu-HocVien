import { LessonStatus } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { AuthRequest, CreateLesson, UpdateLesson } from '@be/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { LessonService } from '../services/lesson.service';

@Controller('lessons')
export class LessonController {
  private readonly logger = new Logger(LessonController.name);

  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async create(@Body() data: CreateLesson) {
    this.logger.log(`Create lesson with data: ${JSON.stringify(data)}`);
    return this.lessonService.create(data);
  }

  @Get('class/:classId')
  @UseGuards(AuthGuard)
  async findByClassId(@Param('classId') classId: string) {
    this.logger.log(`Get lessons for class: ${classId}`);
    return this.lessonService.findByClassId(classId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async update(@Param('id') id: string, @Body() data: UpdateLesson) {
    this.logger.log(`Update lesson ${id} with data: ${JSON.stringify(data)}`);
    return this.lessonService.update(id, data);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR, Role.STUDENT])
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: LessonStatus }
  ) {
    this.logger.log(`Update lesson status ${id} with status: ${data.status}`);
    return this.lessonService.updateStatus(id, data.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async delete(@Param('id') id: string) {
    this.logger.log(`Delete lesson ${id}`);
    return this.lessonService.delete(id);
  }

  @Post(':id/check-in')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR, Role.STUDENT])
  async checkIn(@Param('id') id: string, @Request() request: AuthRequest) {
    this.logger.log(
      `Check-in for lesson ${id} by ${request.user.id} with role ${request.user.role}`
    );

    return this.lessonService.checkIn({
      lessonId: id,
      userId: request.user.id,
      role: request.user.role as Role,
    });
  }
}
