import { LessonPattern } from '.prisma/education-service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LessonPatternService } from '../services/lessonPattern.service';

@Controller()
export class LessonPatternController {
  constructor(private readonly lessonPatternService: LessonPatternService) {}

  @MessagePattern({ cmd: 'create-lesson-pattern' })
  create(data: Omit<LessonPattern, 'id'>) {
    return this.lessonPatternService.create(data);
  }

  @MessagePattern({ cmd: 'create-many-lesson-patterns' })
  createMany(data: Omit<LessonPattern, 'id'>[]) {
    return this.lessonPatternService.createMany(data);
  }

  @MessagePattern({ cmd: 'get-lesson-patterns-by-class' })
  findByClassId(classId: string) {
    return this.lessonPatternService.findByClassId(classId);
  }

  @MessagePattern({ cmd: 'update-lesson-pattern' })
  update(data: { id: string; data: Partial<LessonPattern> }) {
    return this.lessonPatternService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-lesson-pattern' })
  delete(id: string) {
    return this.lessonPatternService.delete(id);
  }
}
