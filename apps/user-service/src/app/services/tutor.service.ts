import { CreateTutor, SearchTutor } from '@be/shared';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable, Logger } from '@nestjs/common';
import elasticClient from '../configs/elastic.config';
import { TUTOR_INDEX } from '../constants/elasticsearch.const';
import { TutorRepository } from '../repositories/tutor.repository';

@Injectable()
export class TutorService {
  private readonly logger: Logger = new Logger(TutorService.name);

  constructor(private readonly tutorRepository: TutorRepository) {}

  createTutor(data: CreateTutor) {
    this.logger.log(`Creating tutor with data: ${JSON.stringify(data)}`);

    return this.tutorRepository.createTutor(data);
  }

  getTutorById(id: string) {
    return this.tutorRepository.getTutorById(id);
  }

  updateTutor(id: string, data: Partial<Omit<CreateTutor, 'id'>>) {
    return this.tutorRepository.updateTutor(id, data);
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
  }: SearchTutor) {
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
        query: {
          bool: {
            must,
            filter,
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}
