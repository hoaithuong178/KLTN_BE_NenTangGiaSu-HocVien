import { LessonStatus } from '.prisma/education-service';
import { BaseResponse, CreateLesson, UpdateLesson } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LessonRepository } from '../repositories/lesson.repository';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(private readonly lessonRepository: LessonRepository) {}

  async create(data: CreateLesson) {
    this.logger.log(`Creating lesson for class ${data.classId}`);

    const res = await this.lessonRepository.create(data);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.CREATED,
    };

    return response;
  }

  async findByClassId(classId: string) {
    this.logger.log(`Finding lessons for class ${classId}`);

    const res = await this.lessonRepository.findByClassId(classId);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async update(id: string, data: UpdateLesson) {
    this.logger.log(`Updating lesson ${id} with data ${JSON.stringify(data)}`);

    const res = await this.lessonRepository.update(id, data);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async updateStatus(id: string, status: LessonStatus) {
    this.logger.log(`Updating lesson ${id} status to ${status}`);

    const res = await this.lessonRepository.updateStatus(id, status);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async delete(id: string) {
    this.logger.log(`Deleting lesson ${id}`);

    const res = await this.lessonRepository.delete(id);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }
}
