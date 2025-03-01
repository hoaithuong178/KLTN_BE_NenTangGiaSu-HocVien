import { Subject } from '.prisma/education-service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SubjectService } from '../services/subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @MessagePattern({ cmd: 'create-subject' })
  create(data: Subject) {
    return this.subjectService.create(data);
  }

  @MessagePattern({ cmd: 'get-all-subjects' })
  findAll() {
    return this.subjectService.findAll();
  }

  @MessagePattern({ cmd: 'get-subject-by-id' })
  findById(id: string) {
    return this.subjectService.findById(id);
  }

  @MessagePattern({ cmd: 'update-subject' })
  update(data: { id: string; data: Partial<Subject> }) {
    return this.subjectService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-subject' })
  delete(id: string) {
    return this.subjectService.delete(id);
  }
}
