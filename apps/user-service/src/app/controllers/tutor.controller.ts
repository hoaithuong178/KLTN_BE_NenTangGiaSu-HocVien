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
}
