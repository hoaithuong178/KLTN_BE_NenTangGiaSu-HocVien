import { CreateTutor } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { TutorRepository } from '../repositories/tutor.repository';

@Injectable()
export class TutorService {
  private readonly logger: Logger = new Logger(TutorService.name);

  constructor(private readonly tutorRepository: TutorRepository) {}

  createTutor(data: CreateTutor) {
    this.logger.log(`Creating tutor with data: ${JSON.stringify(data)}`);

    return this.tutorRepository.createTutor(data);
  }
}
