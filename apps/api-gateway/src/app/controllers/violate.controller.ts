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
import { ViolateService } from '../services/violate.service';

@Controller('violates')
export class ViolateController {
  private readonly logger = new Logger(ViolateController.name);

  constructor(private readonly violateService: ViolateService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async createViolate(
    @Body() data: { userId: string; reason: string; violate: number }
  ) {
    this.logger.log(`Create violate with data: ${JSON.stringify(data)}`);
    return this.violateService.createViolate(data);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async getViolatesByUserId(@Param('userId') userId: string) {
    this.logger.log(`Get violates for user: ${userId}`);
    return this.violateService.getViolatesByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async getViolateById(@Param('id') id: string) {
    this.logger.log(`Get violate by id: ${id}`);
    return this.violateService.getViolateById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async updateViolate(
    @Param('id') id: string,
    @Body() data: { reason?: string; violate?: number }
  ) {
    this.logger.log(`Update violate ${id} with data: ${JSON.stringify(data)}`);
    return this.violateService.updateViolate(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async deleteViolate(@Param('id') id: string) {
    this.logger.log(`Delete violate ${id}`);
    return this.violateService.deleteViolate(id);
  }
}
