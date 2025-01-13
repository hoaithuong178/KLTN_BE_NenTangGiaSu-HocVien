import { CreateTutor } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TutorService {
  constructor(
    @Inject('USER_SERVICE') private readonly tutorService: ClientProxy
  ) {}

  createTutor(data: CreateTutor) {
    return this.tutorService.send({ cmd: 'create_tutor' }, data).toPromise();
  }

  getTutorById(id: string) {
    return this.tutorService.send({ cmd: 'get_tutor' }, id).toPromise();
  }

  updateTutor(id: string, data: Partial<Omit<CreateTutor, 'id'>>) {
    return this.tutorService
      .send({ cmd: 'update_tutor' }, { id, data })
      .toPromise();
  }
}
