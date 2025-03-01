import { Role } from '.prisma/user-service';
import { CreateSubjectDto } from '@be/shared';
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
import { SubjectService } from '../services/subject.service';
@Controller('subjects')
export class SubjectController {
  private readonly logger: Logger = new Logger(SubjectController.name);

  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async create(@Body() data: CreateSubjectDto) {
    this.logger.log(`Create subject with data: ${JSON.stringify(data)}`);
    return this.subjectService.create(data);
  }

  @Get()
  async findAll() {
    this.logger.log('Get all subjects');
    return this.subjectService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Get subject by id: ${id}`);
    return this.subjectService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateSubjectDto>
  ) {
    this.logger.log(`Update subject ${id} with data: ${JSON.stringify(data)}`);
    return this.subjectService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async delete(@Param('id') id: string) {
    this.logger.log(`Delete subject ${id}`);
    return this.subjectService.delete(id);
  }
}
