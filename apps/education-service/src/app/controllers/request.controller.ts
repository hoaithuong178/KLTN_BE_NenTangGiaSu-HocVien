import { RequestStatus } from '.prisma/education-service';
import {
  CreateRequest,
  DeleteRequest,
  GetRequestById,
  UpdateRequest,
} from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RequestService } from '../services/request.service';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @MessagePattern({ cmd: 'create-request' })
  create(data: CreateRequest) {
    return this.requestService.create(data);
  }

  @MessagePattern({ cmd: 'get-all-requests' })
  findAll() {
    return this.requestService.findAll();
  }

  @MessagePattern({ cmd: 'get-request-by-id' })
  findById(data: GetRequestById) {
    return this.requestService.findById(data);
  }

  @MessagePattern({ cmd: 'get-requests-by-from-user-id' })
  findByFromUserId(userId: string) {
    return this.requestService.findByFromUserId(userId);
  }

  @MessagePattern({ cmd: 'get-requests-by-to-user-id' })
  findByToUserId(userId: string) {
    return this.requestService.findByToUserId(userId);
  }

  @MessagePattern({ cmd: 'get-requests-by-user-id' })
  findByUserId(userId: string) {
    return this.requestService.findByUserId(userId);
  }

  @MessagePattern({ cmd: 'update-request' })
  update(data: { id: string; data: Partial<UpdateRequest> }) {
    return this.requestService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'update-request-status' })
  updateStatus(data: {
    id: string;
    userId: string;
    status: RequestStatus;
    feePerSession?: number;
  }) {
    return this.requestService.updateStatus(data);
  }

  @MessagePattern({ cmd: 'delete-request' })
  delete(data: DeleteRequest) {
    return this.requestService.delete(data);
  }
}
