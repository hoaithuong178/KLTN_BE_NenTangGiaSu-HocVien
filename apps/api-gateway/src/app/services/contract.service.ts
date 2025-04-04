import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContractService {
  private readonly logger: Logger = new Logger(ContractService.name);

  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientProxy
  ) {}

  async contracts() {
    this.logger.log('Contract Service - Fetching all contracts');

    return await firstValueFrom(
      this.transactionClient.send({ cmd: 'get_all_contracts' }, {})
    );
  }

  async findContractsByUserId(userId: string) {
    this.logger.log(
      `Contract Service - Finding contracts by user id: ${userId}`
    );

    return await firstValueFrom(
      this.transactionClient.send({ cmd: 'find_contracts_by_user_id' }, userId)
    );
  }
}
