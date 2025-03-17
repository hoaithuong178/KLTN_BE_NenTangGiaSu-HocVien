import { ClassPattern, Grade } from '.prisma/education-service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassPatternService } from '../services/classPattern.service';

@Controller()
export class ClassPatternController {
  constructor(private readonly classPatternService: ClassPatternService) {}

  @MessagePattern({ cmd: 'create-class-pattern' })
  create(data: { tutorId: string; grade: Grade; subject: string }) {
    return this.classPatternService.create(data);
  }

  @MessagePattern({ cmd: 'get-class-patterns-by-tutor' })
  findByTutorId(tutorId: string) {
    return this.classPatternService.findByTutorId(tutorId);
  }

  @MessagePattern({ cmd: 'update-class-pattern' })
  update(data: { id: string; data: Partial<ClassPattern> }) {
    return this.classPatternService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-class-pattern' })
  delete(id: string) {
    return this.classPatternService.delete(id);
  }
}
