import { RequestStatus } from '.prisma/education-service';
import {
  CreateRequest,
  DeleteRequest,
  GetRequestById,
  UpdateRequest,
} from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RequestService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly requestService: ClientProxy
  ) {}

  create(data: CreateRequest) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'create-request' }, data)
    );
  }

  findAll() {
    return lastValueFrom(
      this.requestService.send({ cmd: 'get-all-requests' }, {})
    );
  }

  findById(data: GetRequestById) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'get-request-by-id' }, data)
    );
  }

  findByFromUserId(userId: string) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'get-requests-by-from-user-id' }, userId)
    );
  }

  findByToUserId(userId: string) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'get-requests-by-to-user-id' }, userId)
    );
  }

  findByUserId(userId: string) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'get-requests-by-user-id' }, userId)
    );
  }

  update(id: string, data: Partial<UpdateRequest>) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'update-request' }, { id, data })
    );
  }

  updateStatus(data: {
    id: string;
    userId: string;
    status: RequestStatus;
    feePerSession?: number;
  }) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'update-request-status' }, data)
    );
  }

  delete(data: DeleteRequest) {
    return lastValueFrom(
      this.requestService.send({ cmd: 'delete-request' }, data)
    );
  }
}
