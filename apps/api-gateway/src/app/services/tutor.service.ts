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
}
