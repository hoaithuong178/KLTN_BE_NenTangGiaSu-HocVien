import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  getMe(id: string) {
    this.logger.log(`Getting user with id: ${id}`);

    return this.userRepository.findUserById(id);
  }
}
