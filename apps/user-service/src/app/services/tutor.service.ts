import { TutorProfile } from '.prisma/user-service';
import {
  BaseResponse,
  CreateTutor,
  PaginatedResponse,
  SearchTutor,
} from '@be/shared';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import elasticClient from '../configs/elastic.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { TutorRepository } from '../repositories/tutor.repository';

@Injectable()
export class TutorService {
  private readonly logger: Logger = new Logger(TutorService.name);

  constructor(private readonly tutorRepository: TutorRepository) {}

  async createTutor(data: CreateTutor) {
    this.logger.log(`Creating tutor with data: ${JSON.stringify(data)}`);

    const tutorProfile = await this.tutorRepository.createTutor(data);

    const response: BaseResponse<TutorProfile> = {
      statusCode: HttpStatus.CREATED,
      data: tutorProfile,
    };

    return response;
  }

  async getTutorById(id: string) {
    this.logger.log(`Getting tutor by ID: ${id}`);

    const tutorProfile = await this.tutorRepository.getTutorById(id);

    const response: BaseResponse<TutorProfile> = {
      statusCode: HttpStatus.OK,
      data: tutorProfile,
    };

    return response;
  }

  async updateTutor(id: string, data: Partial<Omit<CreateTutor, 'id'>>) {
    this.logger.log(
      `Updating tutor with ID: ${id} and data: ${JSON.stringify(data)}`
    );

    const tutorProfile = await this.tutorRepository.updateTutor(id, data);

    const response: BaseResponse<TutorProfile> = {
      statusCode: HttpStatus.OK,
      data: tutorProfile,
    };

    return response;
  }

  async searchTutor({
    specialization,
    location,
    fromPrice,
    toPrice,
    gender,
    learningType,
    level,
    rating,
    ...params
  }: SearchTutor) {
    this.logger.log(
      `Searching tutors with data: ${JSON.stringify({
        specialization,
        location,
        fromPrice,
        toPrice,
        gender,
        learningType,
        level,
        rating,
      })}`
    );

    const page = Number(params.page || 1);
    const limit = Number(params.limit || 10);

    const filter: QueryDslQueryContainer[] = [];
    const must: QueryDslQueryContainer[] = [];

    if (specialization) {
      filter.push({
        match: {
          'tutorProfile.specializations': {
            query: specialization,
            operator: 'and',
          },
        },
      });
    }

    if (location) {
      filter.push({
        match: {
          'tutorProfile.tutorLocations': {
            query: location,
            operator: 'or',
          },
        },
      });
    }

    if (fromPrice > 0)
      must.push({
        range: {
          'tutorProfile.hourlyPrice': {
            gte: fromPrice,
          },
        },
      });

    if (toPrice > 0)
      must.push({
        range: {
          'tutorProfile.hourlyPrice': {
            lte: toPrice,
          },
        },
      });

    if (gender)
      must.push({
        match: {
          'userProfile.gender': {
            query: gender,
            operator: 'and',
          },
        },
      });

    if (learningType)
      must.push({
        match: {
          'tutorProfile.learningTypes': {
            query: learningType,
            operator: 'and',
          },
        },
      });

    if (level)
      must.push({
        match: {
          'tutorProfile.level': {
            query: level,
            operator: 'and',
          },
        },
      });

    if (rating)
      must.push({
        range: {
          'tutorProfile.rating': {
            gte: rating,
          },
        },
      });

    const result = await elasticClient.search({
      index: TUTOR_INDEX,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must,
            filter,
          },
        },
      },
    });

    const hits = result.hits.hits;
    const totalItems =
      typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total.value;
    const totalPages = Math.ceil(totalItems / limit);

    const response: PaginatedResponse<TutorProfile[]> = {
      statusCode: HttpStatus.OK,
      data: hits.map((hit) => ({
        ...(hit._source as TutorProfile),
        score: hit._score || 0,
      })),
      pagination: {
        totalPages,
        totalItems,
        page,
        pageSize: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return response;
  }
}
