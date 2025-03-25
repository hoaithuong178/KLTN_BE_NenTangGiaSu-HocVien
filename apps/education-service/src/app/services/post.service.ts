import { Post, PostStatus } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { BaseResponse, DeletePostRequest, PostSearchRequest } from '@be/shared';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import elasticClient from '../configs/elastic.config';
import { POST_ELASTIC_INDEX } from '../constants';
import { PostRepository } from '../repositories/post.repository';
import { SubjectRepository } from '../repositories/subject.repository';

@Injectable()
export class PostService {
  private readonly logger: Logger = new Logger(PostService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly subjectRepository: SubjectRepository,
    @Inject('CHATBOT_EDUCATION_SERVICE')
    private readonly chatbotEducationService: ClientProxy
  ) {}

  async create(data: Post) {
    this.logger.log('Creating post with data: ' + JSON.stringify(data));

    const subject = await this.subjectRepository.findById(String(data.subject));

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
    this.logger.log('Deleting post with data: ' + data);
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

  async search(searchRequest: PostSearchRequest) {
    const {
      query,
      grade,
      title,
      content,
      location,
      minSessionPerWeek,
      maxSessionPerWeek,
      minDuration,
      maxDuration,
      subject,
      requirements,
      mode,
      maxFeePerSession,
      minFeePerSession,
      sessionPerWeek,
    } = searchRequest;

    const page = Number(searchRequest.page) || 1;
    const limit = Number(searchRequest.limit) || 10;

    const must: QueryDslQueryContainer[] = [];

    if (title) {
      must.push({
        match: {
          title: {
            query: title,
            fuzziness: 'AUTO',
          },
        },
      });
    }

    if (content) {
      must.push({
        match: {
          content: {
            query: content,
            fuzziness: 'AUTO',
          },
        },
      });
    }

    if (grade) {
      must.push({ match: { grade } });
    }

    if (location) {
      must.push({
        match: {
          locations: {
            query: location,
            fuzziness: 'AUTO',
            operator: 'AND',
          },
        },
      });
    }

    if (subject) {
      must.push({ match: { 'subject.name': subject } });
    }

    if (mode) {
      must.push({ match: { mode } });
    }

    if (requirements) {
      must.push({
        match: {
          requirements: {
            query: requirements,
            fuzziness: 'AUTO',
          },
        },
      });
    }

    // Range queries
    const rangeQueries = [];

    if (sessionPerWeek) {
      rangeQueries.push({ match: { sessionPerWeek } });
    }

    if (minSessionPerWeek || maxSessionPerWeek) {
      const sessionPerWeekRange: {
        sessionPerWeek: {
          gte?: number;
          lte?: number;
        };
      } = { sessionPerWeek: {} };
      if (minSessionPerWeek)
        sessionPerWeekRange.sessionPerWeek.gte = minSessionPerWeek;
      if (maxSessionPerWeek)
        sessionPerWeekRange.sessionPerWeek.lte = maxSessionPerWeek;
      rangeQueries.push({ range: sessionPerWeekRange });
    }

    if (minDuration || maxDuration) {
      const durationRange: {
        duration: {
          gte?: number;
          lte?: number;
        };
      } = { duration: {} };
      if (minDuration) durationRange.duration.gte = minDuration;
      if (maxDuration) durationRange.duration.lte = maxDuration;
      rangeQueries.push({ range: durationRange });
    }

    if (minFeePerSession || maxFeePerSession) {
      const feePerSessionRange: {
        feePerSession: {
          gte?: number;
          lte?: number;
        };
      } = { feePerSession: {} };

      if (minFeePerSession)
        feePerSessionRange.feePerSession.gte = minFeePerSession;
      if (maxFeePerSession)
        feePerSessionRange.feePerSession.lte = maxFeePerSession;
      rangeQueries.push({ range: feePerSessionRange });
    }

    if (query) {
      must.push({
        query_string: {
          query: String(query),
        },
      });
    }

    must.push({ match: { status: PostStatus.APPROVED } });

    must.push(...rangeQueries);

    const response = await elasticClient.search({
      index: POST_ELASTIC_INDEX,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must,
          },
        },
      },
    });

    const hits = response.hits.hits;
    const totalItems =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : response.hits.total.value;

    const searchResults = hits.map((hit) => ({
      ...(hit._source as Post),
      score: hit._score || 0,
    }));

    const totalPages = Math.ceil(totalItems / limit);

    return {
      statusCode: HttpStatus.OK,
      data: searchResults,
      pagination: {
        totalPages,
        totalItems,
        page,
        pageSize: limit,
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
}
