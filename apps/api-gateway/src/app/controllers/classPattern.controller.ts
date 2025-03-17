import { ClassPattern, Grade } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { AuthRequest } from '@be/shared';
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
import { ClassPatternService } from '../services/classPattern.service';

@Controller('class-patterns')
export class ClassPatternController {
  private readonly logger = new Logger(ClassPatternController.name);

  constructor(private readonly classPatternService: ClassPatternService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async create(
    @Request() req: AuthRequest,
    @Body() data: { grade: Grade; subject: string }
  ) {
    this.logger.log(`Create class pattern with data: ${JSON.stringify(data)}`);
    return this.classPatternService.create({
      ...data,
      tutorId: req.user.id,
    });
  }

  @Get('tutor')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async findByTutorId(@Request() req: AuthRequest) {
    this.logger.log(`Get class patterns for tutor: ${req.user.id}`);
    return this.classPatternService.findByTutorId(req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async update(@Param('id') id: string, @Body() data: Partial<ClassPattern>) {
    this.logger.log(
      `Update class pattern ${id} with data: ${JSON.stringify(data)}`
    );
    return this.classPatternService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.TUTOR])
  async delete(@Param('id') id: string) {
    this.logger.log(`Delete class pattern ${id}`);
    return this.classPatternService.delete(id);
  }
}
