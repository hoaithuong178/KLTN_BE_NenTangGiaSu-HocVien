import { Request } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import {
  BaseResponse,
  CreateRequest,
  DeleteRequest,
  GetRequestById,
  UpdateRequest,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RequestRepository } from '../repositories/request.repository';

@Injectable()
export class RequestService {
  private readonly logger: Logger = new Logger(RequestService.name);

  constructor(private readonly requestRepository: RequestRepository) {}

  async create(data: CreateRequest) {
    this.logger.log('Tạo yêu cầu với dữ liệu: ' + JSON.stringify(data));

    const createdRequest = await this.requestRepository.create(data);

    const response: BaseResponse<Request> = {
      statusCode: HttpStatus.CREATED,
      data: createdRequest,
    };

    return response;
  }

  async findAll() {
    this.logger.log('Lấy tất cả yêu cầu');
    const requests = await this.requestRepository.findAll();

    const response: BaseResponse<Request[]> = {
      statusCode: HttpStatus.OK,
      data: requests,
    };
    return response;
  }

  async findById({ id, userId, role }: GetRequestById) {
    this.logger.log(
      'Lấy yêu cầu theo ID: ' + JSON.stringify({ id, userId, role })
    );
    const request = await (role === Role.ADMIN
      ? this.requestRepository.findById(id)
      : this.requestRepository.findByIdAndUserId(id, userId));

    const response: BaseResponse<Request> = {
      statusCode: HttpStatus.OK,
      data: request,
    };
    return response;
  }

  async findByFromUserId(userId: string) {
    this.logger.log('Lấy yêu cầu theo ID người gửi: ' + userId);
    const requests = await this.requestRepository.findByFromUserId(userId);

    const response: BaseResponse<Request[]> = {
      statusCode: HttpStatus.OK,
      data: requests,
    };
    return response;
  }

  async findByToUserId(userId: string) {
    this.logger.log('Lấy yêu cầu theo ID người nhận: ' + userId);
    const requests = await this.requestRepository.findByToUserId(userId);

    const response: BaseResponse<Request[]> = {
      statusCode: HttpStatus.OK,
      data: requests,
    };
    return response;
  }

  async findByUserId(userId: string) {
    this.logger.log('Lấy yêu cầu theo ID người dùng: ' + userId);
    const requests = await this.requestRepository.findByUserId(userId);

    const response: BaseResponse<Request[]> = {
      statusCode: HttpStatus.OK,
      data: requests,
    };
    return response;
  }

  async update(id: string, data: Partial<UpdateRequest>) {
    this.logger.log('Cập nhật yêu cầu với dữ liệu: ' + JSON.stringify(data));

    try {
      const updatedRequest = await this.requestRepository.update(id, data);

      const response: BaseResponse<Request> = {
        statusCode: HttpStatus.OK,
        data: updatedRequest,
      };
      return response;
    } catch (error) {
      this.logger.error(error);

      if (error.code === 'P2025') {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Yêu cầu không tồn tại',
        });
      } else throw new RpcException(error);
    }
  }

  async delete({ id, userId, role }: DeleteRequest) {
    this.logger.log('Xóa yêu cầu với ID: ' + { id, userId, role });
    const deletedRequest = await (role === Role.ADMIN
      ? this.requestRepository.delete(id)
      : this.requestRepository.deleteByFromUserId(id, userId));

    const response: BaseResponse<Request> = {
      statusCode: HttpStatus.OK,
      data: deletedRequest,
    };
    return response;
  }
}
