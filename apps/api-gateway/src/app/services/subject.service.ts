import { CreateSubjectDto } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SubjectService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly subjectService: ClientProxy
  ) {}

  create(data: CreateSubjectDto) {
    return lastValueFrom(
      this.subjectService.send({ cmd: 'create-subject' }, data)
    );
  }

  findAll() {
    return lastValueFrom(
      this.subjectService.send({ cmd: 'get-all-subjects' }, {})
    );
  }

  findById(id: string) {
    return lastValueFrom(
      this.subjectService.send({ cmd: 'get-subject-by-id' }, id)
    );
  }

  update(id: string, data: Partial<CreateSubjectDto>) {
    return lastValueFrom(
      this.subjectService.send({ cmd: 'update-subject' }, { id, data })
    );
  }

  delete(id: string) {
    return lastValueFrom(
      this.subjectService.send({ cmd: 'delete-subject' }, id)
    );
  }
}
