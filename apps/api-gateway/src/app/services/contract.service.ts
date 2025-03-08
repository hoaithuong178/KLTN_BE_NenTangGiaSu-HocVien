import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ContractService {
  constructor(
    @Inject('CONTRACT_SERVICE') private readonly contractService: ClientProxy
  ) {}

  contracts() {
    return lastValueFrom(this.contractService.send({ cmd: 'contracts' }, {}));
  }
}
