import {
  CreateRequest,
  DeleteRequest,
  GetRequestById,
  UpdateRequest,
} from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RequestService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly requestService: ClientProxy
  ) {}

  create(data: CreateRequest) {
    return this.requestService
      .send({ cmd: 'create-request' }, data)
      .toPromise();
  }

  findAll() {
    return this.requestService
      .send({ cmd: 'get-all-requests' }, {})
      .toPromise();
  }

  findById(data: GetRequestById) {
    return this.requestService
      .send({ cmd: 'get-request-by-id' }, data)
      .toPromise();
  }

  findByFromUserId(userId: string) {
    return this.requestService
      .send({ cmd: 'get-requests-by-from-user-id' }, userId)
      .toPromise();
  }

  findByToUserId(userId: string) {
    return this.requestService
      .send({ cmd: 'get-requests-by-to-user-id' }, userId)
      .toPromise();
  }

  findByUserId(userId: string) {
    return this.requestService
      .send({ cmd: 'get-requests-by-user-id' }, userId)
      .toPromise();
  }

  update(id: string, data: Partial<UpdateRequest>) {
    return this.requestService
      .send({ cmd: 'update-request' }, { id, data })
      .toPromise();
  }

  delete(data: DeleteRequest) {
    return this.requestService
      .send({ cmd: 'delete-request' }, data)
      .toPromise();
  }
}
