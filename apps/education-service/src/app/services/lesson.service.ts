import { LessonStatus } from '.prisma/education-service';
import {
  BaseResponse,
  CheckInLesson,
  CreateLesson,
  UpdateLesson,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LessonRepository } from '../repositories/lesson.repository';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(private readonly lessonRepository: LessonRepository) {}

  async create(data: CreateLesson) {
    this.logger.log(`Creating lesson for class ${data.classId}`);

    const res = await this.lessonRepository.create(data);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.CREATED,
    };

    return response;
  }

  async findByClassId(classId: string) {
    this.logger.log(`Finding lessons for class ${classId}`);

    const res = await this.lessonRepository.findByClassId(classId);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async update(id: string, data: UpdateLesson) {
    this.logger.log(`Updating lesson ${id} with data ${JSON.stringify(data)}`);

    const res = await this.lessonRepository.update(id, data);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async updateStatus(id: string, status: LessonStatus) {
    this.logger.log(`Updating lesson ${id} status to ${status}`);

    const res = await this.lessonRepository.updateStatus(id, status);

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async delete(id: string) {
    this.logger.log(`Deleting lesson ${id}`);

    const res = await this.lessonRepository.updateStatus(
      id,
      LessonStatus.CANCELLED
    );

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }

  async checkIn(data: CheckInLesson) {
    this.logger.log(
      `Check-in for lesson ${data.lessonId} by ${data.role} ${data.userId}`
    );

    // Lấy thông tin buổi học
    const lesson = await this.lessonRepository.findById(data.lessonId);
    if (!lesson) {
      throw new RpcException('Buổi học không tồn tại');
    }

    // Kiểm tra xem người dùng có phải là tutor hoặc student của lớp học này không
    if (
      (data.role === 'TUTOR' && lesson.class.tutorId !== data.userId) ||
      (data.role === 'STUDENT' && lesson.class.studentId !== data.userId)
    ) {
      throw new RpcException(
        'Người dùng không phải là tutor hoặc student của lớp học này'
      );
    }

    // Kiểm tra thời gian điểm danh
    const now = new Date();
    now.setHours(now.getHours() + 7);

    const startTime = new Date(lesson.startTime);
    const checkInStartTime = new Date(startTime.getTime() - 5 * 60 * 1000); // startTime - 5 phút
    const checkInEndTime = new Date(startTime.getTime() + 5 * 60 * 1000); // startTime + 5 phút

    if (now < checkInStartTime || now > checkInEndTime) {
      throw new RpcException(
        'Điểm danh chỉ được thực hiện từ 5 phút trước đến 5 phút sau thời gian bắt đầu của buổi học'
      );
    }

    let newStatus = lesson.status;

    if (lesson.status === LessonStatus.SCHEDULED) {
      newStatus =
        data.role === 'TUTOR'
          ? LessonStatus.TUTOR_MUSTER
          : LessonStatus.STUDENT_MUSTER;
    } else if (
      lesson.status === LessonStatus.TUTOR_MUSTER &&
      data.role === 'STUDENT'
    ) {
      newStatus = LessonStatus.BOTH_MUSTER;
    } else if (
      lesson.status === LessonStatus.STUDENT_MUSTER &&
      data.role === 'TUTOR'
    ) {
      newStatus = LessonStatus.BOTH_MUSTER;
    }

    const res = await this.lessonRepository.updateStatus(
      data.lessonId,
      newStatus
    );

    if (!res) {
      throw new RpcException(
        `Người dùng không phải là ${data.role.toLowerCase()} của lớp học này`
      );
    }

    const response: BaseResponse<typeof res> = {
      data: res,
      statusCode: HttpStatus.OK,
    };

    return response;
  }
}
