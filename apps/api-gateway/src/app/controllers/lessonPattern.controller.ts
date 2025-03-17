import { LessonPattern } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { LessonPatternService } from '../services/lessonPattern.service';

@Controller('lesson-patterns')
export class LessonPatternController {
  private readonly logger = new Logger(LessonPatternController.name);

  constructor(private readonly lessonPatternService: LessonPatternService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async create(@Body() data: Omit<LessonPattern, 'id'>) {
    this.logger.log(`Create lesson pattern with data: ${JSON.stringify(data)}`);
    return this.lessonPatternService.create(data);
  }

  @Post('bulk')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async createMany(@Body() data: Omit<LessonPattern, 'id'>[]) {
    this.logger.log(
      `Create many lesson patterns with data: ${JSON.stringify(data)}`
    );
    return this.lessonPatternService.createMany(data);
  }

  @Get('class/:classId')
  @UseGuards(AuthGuard)
  async findByClassId(@Param('classId') classId: string) {
    this.logger.log(`Get lesson patterns for class: ${classId}`);
    return this.lessonPatternService.findByClassId(classId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async update(@Param('id') id: string, @Body() data: Partial<LessonPattern>) {
    this.logger.log(
      `Update lesson pattern ${id} with data: ${JSON.stringify(data)}`
    );
    return this.lessonPatternService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async delete(@Param('id') id: string) {
    this.logger.log(`Delete lesson pattern ${id}`);
    return this.lessonPatternService.delete(id);
  }
}
