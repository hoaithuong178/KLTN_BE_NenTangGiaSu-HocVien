import { ClassPattern, Grade } from '.prisma/education-service';
import { BaseResponse } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ClassPatternRepository } from '../repositories/classPattern.repository';

@Injectable()
export class ClassPatternService {
  private readonly logger = new Logger(ClassPatternService.name);

  constructor(
    private readonly classPatternRepository: ClassPatternRepository
  ) {}

  async create(data: { tutorId: string; grade: Grade; subject: string }) {
    this.logger.log(`Creating class pattern for tutor ${data.tutorId}`);

    const classPattern = await this.classPatternRepository.create(data);

    return {
      statusCode: 200,
      data: {
        ...classPattern,
        tutor: {
          id: classPattern.tutor.id,
          name: classPattern.tutor.name,
          email: classPattern.tutor.email,
          avatar: classPattern.tutor.avatar,
        },
      },
    };
  }

  async findByTutorId(tutorId: string): Promise<BaseResponse<ClassPattern[]>> {
    this.logger.log(`Finding class patterns for tutor ${tutorId}`);

    const patterns = await this.classPatternRepository.findByTutorId(tutorId);
    return {
      statusCode: 200,
      data: patterns.map((pattern) => ({
        ...pattern,
        tutor: {
          id: pattern.tutor.id,
          name: pattern.tutor.name,
          email: pattern.tutor.email,
          avatar: pattern.tutor.avatar,
        },
      })),
    };
  }

  async update(id: string, data: Partial<ClassPattern>) {
    this.logger.log(`Updating class pattern ${id}`);

    const updated = await this.classPatternRepository.update(id, data);
    return {
      statusCode: 200,
      data: {
        ...updated,
        tutor: {
          id: updated.tutor.id,
          name: updated.tutor.name,
          email: updated.tutor.email,
          avatar: updated.tutor.avatar,
        },
      },
    };
  }

  async delete(id: string): Promise<BaseResponse<ClassPattern>> {
    this.logger.log(`Deleting class pattern ${id}`);

    const deleted = await this.classPatternRepository.delete(id);
    return {
      statusCode: 200,
      data: deleted,
    };
  }
}
