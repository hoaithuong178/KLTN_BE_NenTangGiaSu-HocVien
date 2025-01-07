import { Controller, Get, Logger } from '@nestjs/common';
import { ContractService } from '../services/contract.service';

@Controller('contracts')
export class ContractController {
  private readonly logger: Logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @Get()
  async contracts() {
    this.logger.log(
      'Received request to fetch contracts from contract service'
    );

    return await this.contractService.contracts();
  }
}
