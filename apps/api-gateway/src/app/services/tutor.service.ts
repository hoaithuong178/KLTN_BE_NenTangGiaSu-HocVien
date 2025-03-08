import { CreateTutor, SearchTutor } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TutorService {
  constructor(
    @Inject('USER_SERVICE') private readonly tutorService: ClientProxy
  ) {}

  createTutor(data: CreateTutor) {
    return lastValueFrom(this.tutorService.send({ cmd: 'create_tutor' }, data));
  }

  getTutorById(id: string) {
    return lastValueFrom(this.tutorService.send({ cmd: 'get_tutor' }, id));
  }

  updateTutor(id: string, data: Partial<Omit<CreateTutor, 'id'>>) {
    return lastValueFrom(
      this.tutorService.send({ cmd: 'update_tutor' }, { id, data })
    );
  }

  searchTutor(data: SearchTutor) {
    return lastValueFrom(this.tutorService.send({ cmd: 'search_tutor' }, data));
  }
}
