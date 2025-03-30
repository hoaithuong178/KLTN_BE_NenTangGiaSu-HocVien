import { Injectable } from '@nestjs/common';
import { ContractRepository } from './contract.repository';

@Injectable()
export class ContractService {
  constructor(private readonly contractRepository: ContractRepository) {}
}
