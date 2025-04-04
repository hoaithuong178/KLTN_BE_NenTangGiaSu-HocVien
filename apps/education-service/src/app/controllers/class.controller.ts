import { Class, ClassStatus } from '.prisma/education-service';
import {
  BaseResponse,
  CreateClassRequest,
  CreateContractEvent,
  DeleteClassRequest,
  ExistedError,
  GetClassByIdRequest,
  UpdateClassRequest,
} from '@be/shared';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ClassService } from '../services/class.service';

@Controller()
export class ClassController {
  private readonly logger: Logger = new Logger(ClassController.name);

  constructor(private readonly classService: ClassService) {}

  @MessagePattern({ cmd: 'create-class' })
  async createClass(data: CreateClassRequest): Promise<BaseResponse<Class>> {
    this.logger.log('Creating class with data: ' + JSON.stringify(data));
    return this.classService.create(data);
  }

  @MessagePattern({ cmd: 'get-class-by-id' })
  async getClassById(data: GetClassByIdRequest): Promise<BaseResponse<Class>> {
    this.logger.log('Getting class by id: ' + JSON.stringify(data));
    return this.classService.findById(data);
  }

  @MessagePattern({ cmd: 'get-classes-by-user' })
  async getClassesByUser(userId: string): Promise<BaseResponse<Class[]>> {
    this.logger.log('Getting classes for user: ' + userId);
    return this.classService.findByUserId(userId);
  }

  @MessagePattern({ cmd: 'get-all-classes' })
  async getAllClasses(): Promise<BaseResponse<Class[]>> {
    this.logger.log('Getting all classes');
    return this.classService.findAll();
  }

  @MessagePattern({ cmd: 'update-class' })
  async updateClass(data: {
    id: string;
    data: UpdateClassRequest;
  }): Promise<BaseResponse<Class>> {
    this.logger.log('Updating class: ' + JSON.stringify(data));
    return this.classService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-class' })
  async deleteClass(data: DeleteClassRequest): Promise<BaseResponse<Class>> {
    this.logger.log('Deleting class: ' + JSON.stringify(data));
    return this.classService.delete(data);
  }

  @MessagePattern({ cmd: 'update-class-status' })
  async updateClassStatus(data: {
    id: string;
    status: ClassStatus;
    userId: string;
  }): Promise<BaseResponse<Class>> {
    return this.classService.updateStatus(data.id, data.status, data.userId);
  }

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

      await this.classService.createClassFromContract(event);

      channel.ack(originalMsg);
      return event;
    } catch (error) {
      this.logger.error(
        `Class Controller - Lỗi khi xử lý contract event: ${JSON.stringify(
          error
        )}`
      );

      if (error instanceof ExistedError) channel.ack(originalMsg);
      else channel.nack(originalMsg, false, true);

      throw error;
    }
  }
}
