import { CreateTutor } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TutorService } from '../services/tutor.service';
import { UserService } from '../services/user.service';

@Controller('tutors')
export class TutorController {
  constructor(
    private readonly tutorService: TutorService,
    private readonly userService: UserService
  ) {}

  @MessagePattern({ cmd: 'create_tutor' })
  async createTutor(data: CreateTutor) {
    const result = await this.tutorService.createTutor(data);

    if (result)
      this.userService.signToElasticSearch(data.id).catch(console.error);

    return result;
  }

  @MessagePattern({ cmd: 'get_tutor' })
  getTutorById(id: string) {
    return this.tutorService.getTutorById(id);
  }

  @MessagePattern({ cmd: 'update_tutor' })
  async updateTutor(data: {
    id: string;
    data: Partial<Omit<CreateTutor, 'id'>>;
  }) {
    const result = await this.tutorService.updateTutor(data.id, data.data);

    if (result)
      this.userService.signToElasticSearch(data.id).catch(console.error);

    return result;
  }
}
