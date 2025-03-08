import { Class, ClassStatus, UserPost } from '.prisma/education-service';
import { Role, User } from '.prisma/user-service';
import {
  BaseResponse,
  ClassDetail,
  CreateClassRequest,
  DeleteClassRequest,
  GetClassByIdRequest,
  UpdateClassRequest,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ClassRepository } from '../repositories/class.repository';
import { SubjectRepository } from '../repositories/subject.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ClassService {
  private readonly logger: Logger = new Logger(ClassService.name);

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository,
    private readonly subjectRepository: SubjectRepository
  ) {}

  convertToClassDetail(
    classData: Class & { student: User; tutor: User }
  ): ClassDetail {
    function convertToUserPost(user: User): UserPost {
      return {
        id: user.id,
        name: user.name,
        avatar: '',
      };
    }

    return {
      ...classData,
      student: convertToUserPost(classData.student),
      tutor: convertToUserPost(classData.tutor),
    };
  }

  async create(data: CreateClassRequest) {
    this.logger.log('Creating class with data: ' + JSON.stringify(data));

    const [student, tutor, subject] = await Promise.all([
      this.userRepository.findById(data.studentId),
      this.userRepository.findById(data.tutorId),
      this.subjectRepository.findById(data.subject.id),
    ]);

    if (!student || !tutor || !subject) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Người dùng hoặc môn học không tồn tại',
      });
    }

    if (student.role !== Role.STUDENT || tutor.role !== Role.TUTOR) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Người dùng không phải là học sinh hoặc giáo viên',
      });
    }

    if (subject.name !== data.subject.name) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Môn học không hợp lệ',
      });
    }

    const createdClass = await this.classRepository.create(data as Class);

    const response: BaseResponse<Class> = {
      statusCode: HttpStatus.CREATED,
      data: createdClass,
    };
    return response;
  }

  async findById(data: GetClassByIdRequest) {
    this.logger.log('Finding class by id: ' + data.id);

    const foundClass = await this.classRepository.findById(data.id);
    if (!foundClass) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Lớp học không tồn tại',
      });
    }

    if (
      foundClass.studentId !== data.userId &&
      foundClass.tutorId !== data.userId
    ) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Bạn không có quyền xem thông tin lớp học này',
      });
    }

    const response: BaseResponse<ClassDetail> = {
      statusCode: HttpStatus.OK,
      data: this.convertToClassDetail(foundClass),
    };
    return response;
  }

  async findByUserId(userId: string) {
    this.logger.log('Finding classes by user id: ' + userId);

    const classes = await this.classRepository.findByUserId(userId);

    const convertToClassDetail = this.convertToClassDetail;
    this.logger.log(
      'Converting classes to class detail: ' + convertToClassDetail
    );

    const response: BaseResponse<Class[]> = {
      statusCode: HttpStatus.OK,
      data: classes.map(convertToClassDetail),
    };
    return response;
  }

  async update(id: string, data: UpdateClassRequest) {
    this.logger.log('Updating class with data: ' + JSON.stringify(data));

    try {
      const [student, tutor, subject] = await Promise.all([
        this.userRepository.findById(data.studentId),
        this.userRepository.findById(data.tutorId),
        this.subjectRepository.findById(data.subject.id),
      ]);

      if (!student || !tutor || !subject) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Người dùng hoặc môn học không tồn tại',
        });
      }

      if (student.role !== Role.STUDENT || tutor.role !== Role.TUTOR) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Người dùng không phải là học sinh hoặc giáo viên',
        });
      }

      if (subject.name !== data.subject.name) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Môn học không hợp lệ',
        });
      }

      const updatedClass = await this.classRepository.update(id, data);

      const response: BaseResponse<Class> = {
        statusCode: HttpStatus.OK,
        data: updatedClass,
      };
      return response;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Lớp học không tồn tại',
        });
      }
      throw error;
    }
  }

  async delete(data: DeleteClassRequest) {
    this.logger.log('Deleting class: ' + JSON.stringify(data));

    try {
      const deletedClass = await this.classRepository.delete(
        data.id,
        data.userId
      );

      const response: BaseResponse<Class> = {
        statusCode: HttpStatus.OK,
        data: deletedClass,
      };
      return response;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Lớp học không tồn tại',
        });
      }
      throw error;
    }
  }

  async updateStatus(
    id: string,
    status: ClassStatus,
    userId: string
  ): Promise<BaseResponse<Class>> {
    try {
      const existingClass = await this.classRepository.findById(id);
      const statuses: ClassStatus[] = [];

      if (!existingClass) {
        throw new RpcException('Không tìm thấy lớp học');
      }

      if (existingClass.status !== ClassStatus.PENDING) {
        throw new RpcException(
          'Chỉ có thể cập nhật trạng thái của lớp học đang chờ xác nhận'
        );
      }

      const isStudent = userId === existingClass.studentId;
      const isTutor = userId === existingClass.tutorId;

      if (isStudent) {
        statuses.push(ClassStatus.IN_PROGRESS, ClassStatus.CANCELLED);

        // Student chỉ có thể chuyển từ PENDING sang IN_PROGRESS hoặc CANCELLED
        if (!statuses.includes(status)) {
          throw new RpcException(
            'Học sinh chỉ có thể xác nhận hoặc hủy lớp học'
          );
        }
      } else if (isTutor) {
        // Tutor chỉ có thể chuyển từ PENDING sang CANCELLED
        if (status !== ClassStatus.CANCELLED) {
          throw new RpcException('Gia sư chỉ có thể hủy lớp học');
        }
      } else {
        throw new RpcException(
          'Bạn không có quyền cập nhật trạng thái lớp học này'
        );
      }

      const updatedClass = await this.classRepository.updateStatus(id, status);

      const response: BaseResponse<Class> = {
        statusCode: HttpStatus.OK,
        data: updatedClass,
      };
      return response;
    } catch (error) {
      throw new RpcException(
        error.message || 'Lỗi khi cập nhật trạng thái lớp học'
      );
    }
  }
}
