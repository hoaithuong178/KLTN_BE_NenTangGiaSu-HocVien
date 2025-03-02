import {
  CreateClassRequest,
  DeleteClassRequest,
  GetClassByIdRequest,
  UpdateClassRequest,
} from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClassService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly classService: ClientProxy
  ) {}

  createClass(data: CreateClassRequest) {
    return this.classService.send({ cmd: 'create-class' }, data).toPromise();
  }

  findById(data: GetClassByIdRequest) {
    return this.classService.send({ cmd: 'get-class-by-id' }, data).toPromise();
  }

  findByUserId(userId: string) {
    return this.classService
      .send({ cmd: 'get-classes-by-user' }, userId)
      .toPromise();
  }

  updateClass(id: string, data: UpdateClassRequest) {
    return this.classService
      .send({ cmd: 'update-class' }, { id, data })
      .toPromise();
  }

  deleteClass(data: DeleteClassRequest) {
    return this.classService.send({ cmd: 'delete-class' }, data).toPromise();
  }
}
