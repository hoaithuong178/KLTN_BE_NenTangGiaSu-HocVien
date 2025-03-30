import { BaseResponse } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RecommendRepository } from '../repositories/recommend.repository';
import {
  IRecommendPostForStudentRequest,
  IRecommendTutorForStudentRequest,
} from '../types';

@Injectable()
export class RecommendService {
  private readonly logger: Logger = new Logger(RecommendService.name);

  constructor(private readonly recommendRepository: RecommendRepository) {}

  async recommendTutorForStudent(data: IRecommendTutorForStudentRequest) {
    this.logger.log(`Recommend tutor for student: ${JSON.stringify(data)}`);

    const res = await this.recommendRepository.recommendTutorForStudent(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }

  async recommendPostForStudent(data: IRecommendPostForStudentRequest) {
    this.logger.log(`Recommend post for student: ${JSON.stringify(data)}`);

    const res = await this.recommendRepository.recommendPostForStudent(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }

  async recommendPostForTutor(data: IRecommendPostForStudentRequest) {
    this.logger.log(`Recommend post for tutor: ${JSON.stringify(data)}`);

    const res = await this.recommendRepository.recommendPostForTutor(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }

  async recommendTutorForTutor(data: IRecommendTutorForStudentRequest) {
    this.logger.log(`Recommend tutor for tutor: ${JSON.stringify(data)}`);

    const res = await this.recommendRepository.recommendTutorForTutor(data);

    const response: BaseResponse<typeof res> = {
      statusCode: HttpStatus.OK,
      data: res,
    };

    return response;
  }
}
