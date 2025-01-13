import { CreateTutor } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TutorService } from '../services/tutor.service';

@Controller('tutors')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @MessagePattern({ cmd: 'create_tutor' })
  createTutor(data: CreateTutor) {
    return this.tutorService.createTutor(data);
  }

  @MessagePattern({ cmd: 'get_tutor' })
  getTutorById(id: string) {
    return this.tutorService.getTutorById(id);
  }

  @MessagePattern({ cmd: 'update_tutor' })
  updateTutor(data: { id: string; data: Partial<Omit<CreateTutor, 'id'>> }) {
    return this.tutorService.updateTutor(data.id, data.data);
  }
}
