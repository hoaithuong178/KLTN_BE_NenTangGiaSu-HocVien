import { CreateSubjectDto } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly subjectService: ClientProxy
  ) {}

  create(data: CreateSubjectDto) {
    return this.subjectService
      .send({ cmd: 'create-subject' }, data)
      .toPromise();
  }

  findAll() {
    return this.subjectService
      .send({ cmd: 'get-all-subjects' }, {})
      .toPromise();
  }

  findById(id: string) {
    return this.subjectService
      .send({ cmd: 'get-subject-by-id' }, id)
      .toPromise();
  }

  update(id: string, data: Partial<CreateSubjectDto>) {
    return this.subjectService
      .send({ cmd: 'update-subject' }, { id, data })
      .toPromise();
  }

  delete(id: string) {
    return this.subjectService.send({ cmd: 'delete-subject' }, id).toPromise();
  }
}
