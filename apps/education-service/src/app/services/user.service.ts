import { User } from '.prisma/education-service';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  createUser(data: User) {
    this.logger.log('Creating user with data: ' + JSON.stringify(data));
    return this.userRepository.createUser(data);
  }
}
