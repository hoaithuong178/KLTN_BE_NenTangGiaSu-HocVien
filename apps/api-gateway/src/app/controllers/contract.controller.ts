import { AuthRequest } from '@be/shared';
import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ContractService } from '../services/contract.service';

@Controller('contracts')
export class ContractController {
  private readonly logger: Logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async contracts() {
    this.logger.log(
      'Received request to fetch contracts from contract service'
    );

    return await this.contractService.contracts();
  }

  @Get('user')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['STUDENT', 'TUTOR'])
  async findContractsByUserId(@Request() req: AuthRequest) {
    this.logger.log(
      `Received request to fetch contracts for user: ${req.user.id}`
    );

    return await this.contractService.findContractsByUserId(req.user.id);
  }
}
