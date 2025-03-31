import { LessonStatus } from '.prisma/education-service';
import { CreateLesson, UpdateLesson } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LessonService } from '../services/lesson.service';

@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @MessagePattern({ cmd: 'create-lesson' })
  create(data: CreateLesson) {
    return this.lessonService.create(data);
  }

  @MessagePattern({ cmd: 'get-lessons-by-class' })
  findByClassId(classId: string) {
    return this.lessonService.findByClassId(classId);
  }

  @MessagePattern({ cmd: 'update-lesson' })
  update(data: { id: string; data: UpdateLesson }) {
    return this.lessonService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'update-lesson-status' })
  updateStatus(data: { id: string; status: LessonStatus }) {
    return this.lessonService.updateStatus(data.id, data.status);
  }

  @MessagePattern({ cmd: 'delete-lesson' })
  delete(id: string) {
    return this.lessonService.delete(id);
  }
}
