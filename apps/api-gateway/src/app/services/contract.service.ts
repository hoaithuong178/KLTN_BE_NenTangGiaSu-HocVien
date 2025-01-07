import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ContractService {
  constructor(
    @Inject('CONTRACT_SERVICE') private readonly contractService: ClientProxy
  ) {}

  contracts() {
    return this.contractService.send({ cmd: 'contracts' }, {}).toPromise();
  }
}
