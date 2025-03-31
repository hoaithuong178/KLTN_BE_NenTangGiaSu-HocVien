import {
  Grade,
  Class,
  ClassStatus,
  SubjectClass,
  UserPost,
} from '.prisma/education-service';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
} from 'class-validator';

export type ClassDetail = Class & {
  student: UserPost;
  tutor: UserPost;
};

export class CreateClassRequest {
  @IsString({
    message: 'id: ID không hợp lệ',
  })
  @IsNotEmpty({
    message: 'id: ID không được để trống',
  })
  id!: string;

  @IsString({
    message: 'studentId: ID học sinh không hợp lệ',
  })
  @IsNotEmpty({
    message: 'studentId: ID học sinh không được để trống',
  })
  studentId!: string;

  @IsString({
    message: 'tutorId: ID gia sư không hợp lệ',
  })
  @IsNotEmpty({
    message: 'tutorId: ID gia sư không được để trống',
  })
  tutorId!: string;

  @IsNumber(
    {},
    {
      message: 'feePerSession: Học phí mỗi buổi phải là số',
    }
  )
  @IsNotEmpty({
    message: 'feePerSession: Học phí mỗi buổi không được để trống',
  })
  @Min(0, {
    message: 'feePerSession: Học phí mỗi buổi không được âm',
  })
  feePerSession!: number;

  @IsNumber(
    {},
    {
      message: 'totalFee: Tổng học phí phải là số',
    }
  )
  @IsNotEmpty({
    message: 'totalFee: Tổng học phí không được để trống',
  })
  @Min(0, {
    message: 'totalFee: Tổng học phí không được âm',
  })
  totalFee!: number;

  @IsBoolean({
    message: 'mode: Hình thức học phải là boolean',
  })
  @IsNotEmpty({
    message: 'mode: Hình thức học không được để trống',
  })
  mode!: boolean;

  @IsObject({
    always: true,
    message: 'subject: Môn học không hợp lệ',
  })
  subject!: SubjectClass;
}

export type UpdateClassRequest = Partial<CreateClassRequest> & {
  studentId: string;
  tutorId: string;
};

export class DeleteClassRequest {
  id!: string;
  userId!: string;
}

export interface GetClassByIdRequest {
  id: string;
  userId: string;
}

export interface SearchClassRequest {
  studentId?: string;
  tutorId?: string;
  subject?: string;
  status?: ClassStatus;
  mode?: boolean;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export class CreateClass {
  id!: string;
  studentId!: string;
  tutorId!: string;
  subject!: SubjectClass;
  feePerSession!: number;
  totalFee!: number;
  mode!: boolean;
  grade!: Grade;
  schedules!: string[];
}
