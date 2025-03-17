import { LessonPattern } from '.prisma/education-service';
import { BaseResponse } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LessonPatternService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly educationService: ClientProxy
  ) {}

  create(data: Omit<LessonPattern, 'id'>) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<LessonPattern>>(
        { cmd: 'create-lesson-pattern' },
        data
      )
    );
  }

  createMany(data: Omit<LessonPattern, 'id'>[]) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<{ count: number }>>(
        { cmd: 'create-many-lesson-patterns' },
        data
      )
    );
  }

  findByClassId(classId: string) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<LessonPattern[]>>(
        { cmd: 'get-lesson-patterns-by-class' },
        classId
      )
    );
  }

  update(id: string, data: Partial<LessonPattern>) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<LessonPattern>>(
        { cmd: 'update-lesson-pattern' },
        { id, data }
      )
    );
  }

  delete(id: string) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<LessonPattern>>(
        { cmd: 'delete-lesson-pattern' },
        id
      )
    );
  }
}
