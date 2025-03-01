import { User } from '.prisma/user-service';
import { BaseResponse } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import elasticClient from '../configs/elastic.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async getMe(id: string) {
    this.logger.log(`Getting user with id: ${id}`);

    const user = await this.userRepository.findUserById(id);

    const response: BaseResponse<User> = {
      statusCode: HttpStatus.OK,
      data: user,
    };

    return response;
  }

  async getFullInfo(id: string) {
    const user = await this.userRepository.getFullInfo(id);

    const response: BaseResponse<User> = {
      statusCode: HttpStatus.OK,
      data: user,
    };

    return response;
  }

  async syncToElasticSearch(id: string) {
    const [tutor, user] = await Promise.all([
      new Promise<any>((resolve, reject) => {
        elasticClient
          .get({
            index: TUTOR_INDEX,
            id,
          })
          .then(resolve)
          .catch((error) => {
            if (error.meta.statusCode === 404) {
              resolve(error);
            } else reject(error);
          });
      }), // this.getTutorById(id),
      this.userRepository.getFullInfo(id),
    ]);

    if (!user) throw new Error('User not found');

    const { userProfiles, tutorProfiles, ...restData } = user;

    const newData = {
      ...restData,
      userProfile: userProfiles.length ? userProfiles[0] : null,
      tutorProfile: tutorProfiles.length ? tutorProfiles[0] : null,
    };

    if (tutor.found) {
      await elasticClient.update({
        index: TUTOR_INDEX,
        id: id,
        body: {
          doc: newData,
        },
      });
    } else
      await elasticClient.index({
        index: TUTOR_INDEX,
        id: id,
        body: newData,
      });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);

    const response: BaseResponse<User> = {
      statusCode: HttpStatus.OK,
      data: user,
    };

    return response;
  }
}
