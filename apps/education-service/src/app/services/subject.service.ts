import { Subject } from '.prisma/education-service';
import { BaseResponse } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SubjectRepository } from '../repositories/subject.repository';

@Injectable()
export class SubjectService {
  private readonly logger: Logger = new Logger(SubjectService.name);

  constructor(private readonly subjectRepository: SubjectRepository) {}

  async create(data: Subject) {
    this.logger.log('Creating subject with data: ' + JSON.stringify(data));

    const subject: Subject = await this.subjectRepository.create(data);

    const response: BaseResponse<Subject> = {
      statusCode: HttpStatus.CREATED,
      data: subject,
    };

    return response;
  }

  async findAll() {
    this.logger.log('Getting all subjects');
    const subjects: Subject[] = await this.subjectRepository.findAll();

    const response: BaseResponse<Subject[]> = {
      statusCode: HttpStatus.OK,
      data: subjects,
    };

    return response;
  }

  async findById(id: string) {
    this.logger.log('Getting subject by ID: ' + id);
    const subject: Subject = await this.subjectRepository.findById(id);

    const response: BaseResponse<Subject> = {
      statusCode: HttpStatus.OK,
      data: subject,
    };

    return response;
  }

  async update(id: string, data: Partial<Subject>) {
    this.logger.log('Updating subject with data: ' + JSON.stringify(data));
    const subject: Subject = await this.subjectRepository.update(id, data);

    const response: BaseResponse<Subject> = {
      statusCode: HttpStatus.OK,
      data: subject,
    };

    return response;
  }

  async delete(id: string) {
    this.logger.log('Deleting subject with ID: ' + id);
    await this.subjectRepository.delete(id);

    const response: BaseResponse<Subject> = {
      statusCode: HttpStatus.OK,
      data: null,
    };

    return response;
  }
}
