import {
  CreateClassRequest,
  DeleteClassRequest,
  GetClassByIdRequest,
  UpdateClassRequest,
} from '@be/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClassService {
  private readonly logger = new Logger(ClassService.name);

  constructor(
    @Inject('EDUCATION_SERVICE') private readonly classService: ClientProxy
  ) {}

  createClass(data: CreateClassRequest) {
    return lastValueFrom(this.classService.send({ cmd: 'create-class' }, data));
  }

  findById(data: GetClassByIdRequest) {
    return lastValueFrom(
      this.classService.send({ cmd: 'get-class-by-id' }, data)
    );
  }

  findByUserId(userId: string) {
    return lastValueFrom(
      this.classService.send({ cmd: 'get-classes-by-user' }, userId)
    );
  }

  updateClass(id: string, data: UpdateClassRequest) {
    return lastValueFrom(
      this.classService.send({ cmd: 'update-class' }, { id, data })
    );
  }

  deleteClass(data: DeleteClassRequest) {
    return lastValueFrom(this.classService.send({ cmd: 'delete-class' }, data));
  }

  async findAll() {
    this.logger.log('Finding all classes');
    return this.classService.send({ cmd: 'get-all-classes' }, {});
  }
}
