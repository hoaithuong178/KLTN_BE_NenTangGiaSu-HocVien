import { Role } from '.prisma/user-service';
import {
  AuthRequest,
  CreateClassRequest,
  UpdateClassRequest,
} from '@be/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ClassService } from '../services/class.service';

@Controller('classes')
export class ClassController {
  private readonly logger: Logger = new Logger(ClassController.name);

  constructor(private readonly classService: ClassService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async createClass(
    @Body() data: CreateClassRequest,
    @Request() req: AuthRequest
  ) {
    this.logger.log(`Create class with data: ${JSON.stringify(data)}`);

    if (![data.studentId, data.tutorId].includes(req.user.id)) {
      throw new UnauthorizedException('Bạn không có quyền tạo lớp học');
    }

    return this.classService.createClass(data);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async getClasses(@Request() req: AuthRequest) {
    this.logger.log(`Get classes for user: ${req.user.id}`);
    return this.classService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getClassById(@Param('id') id: string, @Request() req: AuthRequest) {
    this.logger.log(`Get class by id: ${id}`);
    return this.classService.findById({
      id,
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateClass(
    @Param('id') id: string,
    @Body() data: UpdateClassRequest,
    @Request() req: AuthRequest
  ) {
    this.logger.log(`Update class ${id} with data: ${JSON.stringify(data)}`);

    if (![data.studentId, data.tutorId].includes(req.user.id)) {
      throw new UnauthorizedException('Bạn không có quyền cập nhật lớp học');
    }

    if (!data.subject?.id || !data.subject?.name) {
      throw new BadRequestException('Môn học không hợp lệ');
    }

    return this.classService.updateClass(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteClass(@Param('id') id: string, @Request() req: AuthRequest) {
    this.logger.log(`Delete class ${id}`);
    return this.classService.deleteClass({
      id,
      userId: req.user.id,
    });
  }
}
