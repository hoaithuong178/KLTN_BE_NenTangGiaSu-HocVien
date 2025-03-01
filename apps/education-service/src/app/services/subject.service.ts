import { Subject } from '.prisma/education-service';
import { Injectable, Logger } from '@nestjs/common';
import { SubjectRepository } from '../repositories/subject.repository';

@Injectable()
export class SubjectService {
  private readonly logger: Logger = new Logger(SubjectService.name);

  constructor(private readonly subjectRepository: SubjectRepository) {}

  create(data: Subject) {
    this.logger.log('Creating subject with data: ' + JSON.stringify(data));
    return this.subjectRepository.create(data);
  }

  findAll() {
    this.logger.log('Getting all subjects');
    return this.subjectRepository.findAll();
  }

  findById(id: string) {
    this.logger.log('Getting subject by ID: ' + id);
    return this.subjectRepository.findById(id);
  }

  update(id: string, data: Partial<Subject>) {
    this.logger.log('Updating subject with data: ' + JSON.stringify(data));
    return this.subjectRepository.update(id, data);
  }

  delete(id: string) {
    this.logger.log('Deleting subject with ID: ' + id);
    return this.subjectRepository.delete(id);
  }
}
