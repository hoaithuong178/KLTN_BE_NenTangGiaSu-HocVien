import { ClassPattern, Grade } from '.prisma/education-service';
import { BaseResponse } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClassPatternService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly educationService: ClientProxy
  ) {}

  create(data: { tutorId: string; grade: Grade; subject: string }) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<ClassPattern>>(
        { cmd: 'create-class-pattern' },
        data
      )
    );
  }

  findByTutorId(tutorId: string) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<ClassPattern[]>>(
        { cmd: 'get-class-patterns-by-tutor' },
        tutorId
      )
    );
  }

  update(id: string, data: Partial<ClassPattern>) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<ClassPattern>>(
        { cmd: 'update-class-pattern' },
        { id, data }
      )
    );
  }

  delete(id: string) {
    return lastValueFrom(
      this.educationService.send<BaseResponse<ClassPattern>>(
        { cmd: 'delete-class-pattern' },
        id
      )
    );
  }
}
