import { Request, RequestStatus } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import {
  BaseResponse,
  CreateNotificationRequest,
  CreateRequest,
  DeleteRequest,
  GetRequestById,
  UpdateRequest,
} from '@be/shared';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RequestRepository } from '../repositories/request.repository';

@Injectable()
export class RequestService {
  private readonly logger: Logger = new Logger(RequestService.name);

  constructor(
    private readonly requestRepository: RequestRepository,
    @Inject('USER_SERVICE')
    private readonly notificationClient: ClientProxy
  ) {}

  async create(data: CreateRequest) {
    this.logger.log('Tạo yêu cầu với dữ liệu: ' + JSON.stringify(data));

    const createdRequest = await this.requestRepository.create(data);

    const notification: CreateNotificationRequest = {
      title:
        data.type === 'RECEIVE_CLASS'
          ? 'Yêu cầu dạy học mới'
          : 'Yêu cầu học mới',
      message:
        data.type === 'RECEIVE_CLASS'
          ? `Gia sư ${data.from.name} muốn đăng ký dạy lớp của bạn`
          : `Học viên ${data.from.name} muốn đăng ký học với bạn`,
      recipientId: data.to.id,
      type: data.type === 'TEACH_REQUEST' ? 'TUTOR_REQUEST' : 'RECEIVE_CLASS',
      link: createdRequest.id,
    };

    this.notificationClient.emit('create_notification', notification);

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

  private sendNotification(request: Request) {
    const status = request.status;

    const notification: CreateNotificationRequest = {
      title: '',
      message: '',
      recipientId:
        status === RequestStatus.CANCELLED ? request.to.id : request.from.id,
      type:
        request.type === 'TEACH_REQUEST' ? 'TUTOR_REQUEST' : 'RECEIVE_CLASS',
      link: request.id,
    };

    switch (status) {
      case RequestStatus.ACCEPTED:
        notification.title = 'Yêu cầu đã được chấp nhận';
        notification.message =
          request.type === 'TEACH_REQUEST'
            ? `Gia sư ${request.to.name} đã chấp nhận yêu cầu dạy học của bạn`
            : `Học viên ${request.to.name} đã chấp nhận yêu cầu học của bạn`;
        break;
      case RequestStatus.REJECTED:
        notification.title = 'Yêu cầu đã bị từ chối';
        notification.message =
          request.type === 'TEACH_REQUEST'
            ? `Gia sư ${request.to.name} đã từ chối yêu cầu dạy học của bạn`
            : `Học viên ${request.to.name} đã từ chối yêu cầu học của bạn`;
        break;
      case RequestStatus.CANCELLED:
        notification.title = 'Yêu cầu đã bị hủy';
        notification.message =
          request.type === 'TEACH_REQUEST'
            ? `Học viên ${request.from.name} đã hủy yêu cầu dạy học`
            : `Gia sư ${request.from.name} đã hủy yêu cầu học`;
        break;
      case RequestStatus.PRICE_NEGOTIATION:
        notification.title = 'Đề xuất học phí mới';
        notification.message = `Học phí mới được đề xuất: ${
          request.feePerSessions.at(-1)?.price
        } VNĐ/buổi`;
        break;
    }

    this.notificationClient.emit('create_notification', notification);
  }

  private validatePermission(
    request: Request,
    status: RequestStatus,
    userId: string,
    feePerSession?: number
  ) {
    const fromId =
      request.feePerSessions.length % 2 === 0 ? request.from.id : request.to.id;

    switch (status) {
      case 'ACCEPTED':
      case 'REJECTED':
        if (fromId !== userId) {
          throw new RpcException('Bạn không có quyền thực hiện hành động này');
        }
        break;
      case 'CANCELLED':
        if (request.from.id !== userId) {
          throw new RpcException('Bạn không có quyền thực hiện hành động này');
        }
        break;
      case 'PRICE_NEGOTIATION':
        if (request.from.id !== userId && request.to.id !== userId) {
          throw new RpcException('Bạn không có quyền thực hiện hành động này');
        }
        if (!feePerSession) {
          throw new RpcException('Vui lòng nhập học phí mới');
        }
        break;
      default:
        throw new RpcException('Trạng thái không hợp lệ');
    }
  }

  private validateStatus({
    request,
    status,
    feePerSession,
    userId,
  }: {
    request: Request;
    status: RequestStatus;
    feePerSession?: number;
    userId: string;
  }) {
    if (!request) {
      throw new RpcException('Yêu cầu không tồn tại');
    }

    if (request.status === RequestStatus.CANCELLED) {
      throw new RpcException('Yêu cầu đã bị hủy');
    }

    if (request.status === RequestStatus.ACCEPTED) {
      throw new RpcException('Yêu cầu đã được chấp nhận');
    }

    if (
      request.status === RequestStatus.REJECTED &&
      status !== RequestStatus.PRICE_NEGOTIATION
    ) {
      throw new RpcException('Yêu cầu đã bị từ chối');
    }

    this.validatePermission(request, status, userId, feePerSession);
  }

  private createClassNotification(request: Request) {
    if (request.status !== RequestStatus.ACCEPTED) {
      return;
    }

    const notification: CreateNotificationRequest = {
      title: 'Tạo lớp học mới',
      message:
        request.type === 'TEACH_REQUEST'
          ? `Bạn đã chấp nhận yêu cầu học của ${request.from.name}, hãy tạo lớp học mới ngay.`
          : `Yêu cầu nhận lớp của bạn đã được ${request.to.name} chấp nhận, hãy tạo lớp học mới ngay.`,
      recipientId:
        request.type === 'TEACH_REQUEST' ? request.to.id : request.from.id,
      type: 'ACCEPTED_REQUEST',
      link: request.id,
    };

    this.notificationClient.emit('create_notification', notification);
  }

  async updateStatus({
    id,
    userId,
    status,
    feePerSession,
  }: {
    id: string;
    userId: string;
    status: RequestStatus;
    feePerSession?: number;
  }) {
    const request = await this.requestRepository.findById(id);

    this.validateStatus({
      request,
      status,
      feePerSession,
      userId,
    });

    const updatedRequest = await this.requestRepository.updateStatus(
      id,
      status,
      feePerSession
    );

    this.sendNotification(updatedRequest);
    this.createClassNotification(updatedRequest);

    const response: BaseResponse<Request> = {
      statusCode: HttpStatus.OK,
      data: updatedRequest,
    };
    return response;
  }

  async delete({ id, userId, role }: DeleteRequest) {
    this.logger.log(
      'Xóa yêu cầu với ID: ' + JSON.stringify({ id, userId, role })
    );
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
