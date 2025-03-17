import { LessonPattern } from '.prisma/education-service';
import { BaseResponse } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { LessonPatternRepository } from '../repositories/lessonPattern.repository';

@Injectable()
export class LessonPatternService {
  private readonly logger = new Logger(LessonPatternService.name);

  constructor(
    private readonly lessonPatternRepository: LessonPatternRepository
  ) {}

  async create(
    data: Omit<LessonPattern, 'id'>
  ): Promise<BaseResponse<LessonPattern>> {
    this.logger.log(`Creating lesson pattern for class ${data.classId}`);

    const lessonPattern = await this.lessonPatternRepository.create(data);
    return {
      statusCode: 200,
      data: lessonPattern,
    };
  }

  async createMany(
    data: Omit<LessonPattern, 'id'>[]
  ): Promise<BaseResponse<{ count: number }>> {
    this.logger.log(`Creating multiple lesson patterns`);

    const result = await this.lessonPatternRepository.createMany(data);
    return {
      statusCode: 200,
      data: { count: result.count },
    };
  }

  async findByClassId(classId: string): Promise<BaseResponse<LessonPattern[]>> {
    this.logger.log(`Finding lesson patterns for class ${classId}`);

    const patterns = await this.lessonPatternRepository.findByClassId(classId);
    return {
      statusCode: 200,
      data: patterns,
    };
  }

  async update(
    id: string,
    data: Partial<LessonPattern>
  ): Promise<BaseResponse<LessonPattern>> {
    this.logger.log(`Updating lesson pattern ${id}`);

    const updated = await this.lessonPatternRepository.update(id, data);
    return {
      statusCode: 200,
      data: updated,
    };
  }

  async delete(id: string): Promise<BaseResponse<LessonPattern>> {
    this.logger.log(`Deleting lesson pattern ${id}`);

    const deleted = await this.lessonPatternRepository.delete(id);
    return {
      statusCode: 200,
      data: deleted,
    };
  }
}
