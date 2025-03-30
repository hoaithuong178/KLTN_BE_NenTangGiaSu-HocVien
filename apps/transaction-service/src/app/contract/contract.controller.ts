import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ContractService } from './contract.service';

@Controller()
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @EventPattern('contract.created')
  async handleContractCreated(
    @Payload() event: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log('Contract Controller nhận được sự kiện contract:', event);

      // const data: CreateClassRequest = {
      //   id:
      // }

      // const createdClass = await this.classService.createClass(data)

      // Đánh dấu message đã được xử lý thành công
      return event;
    } catch (error) {
      this.logger.error(
        'Contract Controller - Lỗi khi xử lý contract event:',
        error
      );

      throw error;
    }
  }
}
