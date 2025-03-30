import { User } from '.prisma/education-service';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostRepository } from '../repositories/post.repository';
import { RequestRepository } from '../repositories/request.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly requestRepository: RequestRepository,
    private readonly prismaService: PrismaService
  ) {}

  createUser(data: User) {
    this.logger.log('Creating user with data: ' + JSON.stringify(data));
    return this.userRepository.createUser({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar ?? '',
      phone: data.phone,
      password: data.password,
      role: data.role,
    } as User);
  }

  async updateAvatar(userId: string, avatar: string) {
    const [user] = await this.prismaService.$transaction([
      this.userRepository.updateAvatar(userId, avatar),
      this.postRepository.updateUser({ id: userId, avatar }),
      this.requestRepository.updateToUser({ id: userId, avatar }),
      this.requestRepository.updateFromUser({ id: userId, avatar }),
    ]);

    return user;
  }
}
