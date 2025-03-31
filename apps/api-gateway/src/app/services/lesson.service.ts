import { LessonStatus } from '.prisma/education-service';
import { CreateLesson, UpdateLesson } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LessonService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly educationClient: ClientProxy
  ) {}

  create(data: CreateLesson) {
    return this.educationClient.send({ cmd: 'create-lesson' }, data);
  }

  findByClassId(classId: string) {
    return this.educationClient.send({ cmd: 'get-lessons-by-class' }, classId);
  }

  update(id: string, data: UpdateLesson) {
    return this.educationClient.send({ cmd: 'update-lesson' }, { id, data });
  }

  updateStatus(id: string, status: LessonStatus) {
    return this.educationClient.send(
      { cmd: 'update-lesson-status' },
      { id, status }
    );
  }

  delete(id: string) {
    return this.educationClient.send({ cmd: 'delete-lesson' }, id);
  }
}
