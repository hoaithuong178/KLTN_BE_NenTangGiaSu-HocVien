import { CreateContractEvent, ExistedError } from '@be/shared';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ContractService } from './contract.service';

@Controller()
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @EventPattern('contract.created')
  async handleContractCreated(
    @Payload() event: CreateContractEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Class Controller nhận được sự kiện contract: ${JSON.stringify(event)}`
      );

      if (
        event.contractId.startsWith('contract_') ||
        event.studentId.startsWith('student_')
      ) {
        channel.ack(originalMsg);
        return;
      }

      const contract = await this.contractService.findById(event.contractId);

      if (contract) {
        throw new ExistedError('Hợp đồng đã tồn tại');
      }

      await this.contractService.createContract(event);

      channel.ack(originalMsg);
      return event;
    } catch (error) {
      this.logger.error(
        'Class Controller - Lỗi khi xử lý contract event:',
        error
      );

      if (error instanceof ExistedError) channel.ack(originalMsg);
      else channel.nack(originalMsg, false, true);

      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_contracts_by_user_id' })
  async findContractsByUserId(@Payload() userId: string) {
    this.logger.log(
      `Contract Controller - Finding contracts by user id: ${userId}`
    );

    try {
      const contracts = await this.contractService.findByUserId(userId);
      return {
        data: contracts,
        statusCode: 200,
      };
    } catch (error) {
      this.logger.error(
        'Contract Controller - Lỗi khi tìm hợp đồng theo người dùng:',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_all_contracts' })
  async getAllContracts() {
    return await this.contractService.getAllContracts();
  }
}
