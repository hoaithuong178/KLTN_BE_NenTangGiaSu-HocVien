import { Post, PostStatus } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { BaseResponse, DeletePostRequest, PostSearchRequest } from '@be/shared';
import {
  QueryDslOperator,
  QueryDslQueryContainer,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import elasticClient from '../configs/elastic.config';
import { POST_ELASTIC_INDEX } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { PostRepository } from '../repositories/post.repository';
import { RejectPostRepository } from '../repositories/rejectPost.repository';
import { SubjectRepository } from '../repositories/subject.repository';

interface MatchFieldOption {
  field?: string;
  fuzziness?: string | number;
  operator?: QueryDslOperator;
  query?: string;
}

@Injectable()
export class PostService {
  private readonly logger: Logger = new Logger(PostService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly prismaService: PrismaService,
    private readonly rejectPostRepository: RejectPostRepository,
    @Inject('CHATBOT_EDUCATION_SERVICE')
    private readonly chatbotEducationService: ClientProxy
  ) {}

  async create(data: Post) {
    this.logger.log('Creating post with data: ' + JSON.stringify(data));

    const subject = await this.subjectRepository.findById(
      data.subject as unknown as string
    );

    if (!subject) {
      throw new RpcException('Subject not found');
    }

    const createdPost = await this.postRepository.create({
      ...data,
      subject,
    });

    // Đồng bộ post mới vào Elasticsearch
    elasticClient
      .index({
        index: POST_ELASTIC_INDEX,
        id: createdPost.id,
        body: createdPost,
      })
      .catch((error) =>
        this.logger.error('Lỗi khi đồng bộ post mới vào Elasticsearch:', error)
      );

    this.chatbotEducationService.emit('post-created', createdPost);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.CREATED,
      data: createdPost,
    };

    return response;
  }

  async findAll() {
    this.logger.log('Getting all posts');
    const posts = await this.postRepository.findAll();

    const response: BaseResponse<Post[]> = {
      statusCode: HttpStatus.OK,
      data: posts,
    };
    return response;
  }

  async findAllApproved() {
    this.logger.log('Getting all approved posts');
    const posts = await this.postRepository.findAllApproved();

    const response: BaseResponse<Post[]> = {
      statusCode: HttpStatus.OK,
      data: posts,
    };
    return response;
  }

  async findById(id: string) {
    this.logger.log('Getting post by ID: ' + id);
    const post = await this.postRepository.findById(id);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.OK,
      data: post,
    };
    return response;
  }

  async update(id: string, data: Partial<Post>) {
    this.logger.log('Updating post with data: ' + JSON.stringify(data));
    const updatedPost = await this.postRepository.update(id, data);

    // Đồng bộ post đã cập nhật vào Elasticsearch
    elasticClient
      .update({
        index: POST_ELASTIC_INDEX,
        id: id,
        body: {
          doc: updatedPost,
        },
      })
      .catch((error) =>
        this.logger.error(
          'Lỗi khi đồng bộ post đã cập nhật vào Elasticsearch:',
          error
        )
      );

    this.chatbotEducationService.emit('post-updated', updatedPost);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.OK,
      data: updatedPost,
    };
    return response;
  }

  async delete(data: DeletePostRequest) {
    this.logger.log('Deleting post with data: ' + JSON.stringify(data));
    let deletedPost: Post | null = null;

    if (data.role === Role.ADMIN) {
      deletedPost = await this.postRepository.delete(data.postId);
    } else {
      deletedPost = await this.postRepository.deleteByUser(
        data.postId,
        data.userId
      );
    }

    // Xóa post khỏi Elasticsearch
    elasticClient
      .delete({
        index: POST_ELASTIC_INDEX,
        id: data.postId,
      })
      .catch((error) =>
        this.logger.error('Lỗi khi xóa post khỏi Elasticsearch:', error)
      );

    this.chatbotEducationService.emit('post-deleted', deletedPost);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.OK,
      data: deletedPost,
    };
    return response;
  }

  private buildMatchQueries(
    searchRequest: PostSearchRequest
  ): QueryDslQueryContainer[] {
    const must: QueryDslQueryContainer[] = [];

    const matchFields: Record<string, MatchFieldOption> = {
      title: { fuzziness: 'AUTO' },
      content: { fuzziness: 'AUTO' },
      grade: {},
      'subject.name': { field: searchRequest.subject },
      mode: {},
      requirements: { fuzziness: 'AUTO' },
      locations: {
        query: searchRequest.location,
        fuzziness: 'AUTO',
        operator: 'AND' as QueryDslOperator,
      },
    };

    Object.entries(matchFields).forEach(([field, options]) => {
      const value =
        options.field || searchRequest[field as keyof PostSearchRequest];
      if (value) {
        must.push({
          match: {
            [field]: {
              query: value,
              ...options,
            },
          },
        });
      }
    });

    return must;
  }

  private buildRangeQueries(
    searchRequest: PostSearchRequest
  ): QueryDslQueryContainer[] {
    const {
      minSessionPerWeek,
      maxSessionPerWeek,
      minDuration,
      maxDuration,
      minFeePerSession,
      maxFeePerSession,
      sessionPerWeek,
    } = searchRequest;

    const rangeQueries = [];

    if (sessionPerWeek) {
      rangeQueries.push({ match: { sessionPerWeek } });
    }

    const ranges = {
      sessionPerWeek: { min: minSessionPerWeek, max: maxSessionPerWeek },
      duration: { min: minDuration, max: maxDuration },
      feePerSession: { min: minFeePerSession, max: maxFeePerSession },
    };

    Object.entries(ranges).forEach(([field, { min, max }]) => {
      if (min || max) {
        rangeQueries.push({
          range: {
            [field]: {
              ...(min && { gte: min }),
              ...(max && { lte: max }),
            },
          },
        });
      }
    });

    return rangeQueries;
  }

  async search(searchRequest: PostSearchRequest) {
    const must = [
      ...this.buildMatchQueries(searchRequest),
      ...this.buildRangeQueries(searchRequest),
    ];

    if (searchRequest.query) {
      must.push({ query_string: { query: String(searchRequest.query) } });
    }
    must.push({ match: { status: PostStatus.APPROVED } });

    const { page = 1, limit = 10 } = searchRequest;

    const response = await elasticClient.search({
      index: POST_ELASTIC_INDEX,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: { bool: { must } },
      },
    });

    return this.formatSearchResponse(
      response as SearchResponse<Post>,
      page,
      limit
    );
  }

  private formatSearchResponse(
    response: SearchResponse<Post>,
    page: number,
    limit: number
  ) {
    const hits = response.hits.hits;
    const totalItems =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : response.hits.total.value;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      statusCode: HttpStatus.OK,
      data: hits.map((hit) => ({
        ...hit._source,
        score: hit._score || 0,
      })),
      pagination: {
        totalPages,
        totalItems,
        page: Number(page),
        pageSize: Number(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async syncPostsToElasticsearch() {
    try {
      this.logger.log('Bắt đầu đồng bộ posts vào Elasticsearch');

      // Lấy tất cả posts từ database
      const posts = await this.postRepository.findAll();

      // Xóa index cũ nếu tồn tại
      const indexExists = await elasticClient.indices.exists({
        index: POST_ELASTIC_INDEX,
      });

      if (indexExists) {
        await elasticClient.indices.delete({
          index: POST_ELASTIC_INDEX,
        });
      }

      // Tạo index mới
      await elasticClient.indices.create({
        index: POST_ELASTIC_INDEX,
      });

      // Bulk insert posts vào Elasticsearch
      const body = posts.flatMap((post) => [
        { index: { _index: POST_ELASTIC_INDEX, _id: post.id } },
        post,
      ]);

      if (body.length > 0) {
        const response = await elasticClient.bulk({ body });
        if (response.errors) {
          this.logger.error('Lỗi khi bulk insert vào Elasticsearch');
        }
      }

      this.logger.log(`Đã đồng bộ ${posts.length} posts vào Elasticsearch`);
    } catch (error) {
      this.logger.error('Lỗi khi đồng bộ posts vào Elasticsearch:', error);
      throw error;
    }
  }

  async approve(id: string) {
    this.logger.log('Approving post with ID: ' + id);
    const updatedPost = await this.postRepository.update(id, {
      status: PostStatus.APPROVED,
    });

    // Đồng bộ post đã cập nhật vào Elasticsearch
    elasticClient
      .update({
        index: POST_ELASTIC_INDEX,
        id: id,
        body: {
          doc: updatedPost,
        },
      })
      .catch((error) =>
        this.logger.error(
          'Lỗi khi đồng bộ post đã cập nhật vào Elasticsearch:',
          error
        )
      );

    this.chatbotEducationService.emit('post-updated', updatedPost);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.OK,
      data: updatedPost,
    };
    return response;
  }

  async reject(id: string, reason: string) {
    this.logger.log(`Rejecting post ${id} with reason: ${reason}`);

    const [updatedPost] = await this.prismaService.$transaction([
      this.postRepository.update(id, {
        status: PostStatus.REJECTED,
      }),
      this.rejectPostRepository.create({
        postId: id,
        reason,
      }),
    ]);

    // Đồng bộ post đã cập nhật vào Elasticsearch
    elasticClient
      .update({
        index: POST_ELASTIC_INDEX,
        id: id,
        body: {
          doc: updatedPost,
        },
      })
      .catch((error) =>
        this.logger.error(
          'Lỗi khi đồng bộ post đã cập nhật vào Elasticsearch:',
          error
        )
      );

    this.chatbotEducationService.emit('post-updated', updatedPost);

    const response: BaseResponse<Post> = {
      statusCode: HttpStatus.OK,
      data: updatedPost,
    };
    return response;
  }
}
