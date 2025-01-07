import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('contracts')
export class ContractController {
  @MessagePattern({ cmd: 'contracts' })
  contracts() {
    return '1234';
  }
}
