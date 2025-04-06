import { Role } from '.prisma/user-service';
import { CreateBenefitDto, UpdateBenefitDto } from '@be/shared';
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
import { BenefitService } from '../services/benefit.service';

@Controller('benefits')
export class BenefitController {
  private readonly logger: Logger = new Logger(BenefitController.name);

  constructor(private readonly benefitService: BenefitService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  createBenefit(@Body() data: CreateBenefitDto) {
    this.logger.log(`Creating benefit: ${JSON.stringify(data)}`);

    return this.benefitService.createBenefit(data);
  }

  @Get()
  findAllBenefits() {
    this.logger.log('Finding all benefits');

    return this.benefitService.findAllBenefits();
  }

  @Get(':id')
  findBenefitById(@Param('id') id: string) {
    this.logger.log(`Finding benefit by id: ${id}`);

    return this.benefitService.findBenefitById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  updateBenefit(@Param('id') id: string, @Body() data: UpdateBenefitDto) {
    this.logger.log(
      `Updating benefit by id: ${id} with data: ${JSON.stringify(data)}`
    );

    return this.benefitService.updateBenefit(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  deleteBenefit(@Param('id') id: string) {
    this.logger.log(`Deleting benefit by id: ${id}`);

    return this.benefitService.deleteBenefit(id);
  }
}
