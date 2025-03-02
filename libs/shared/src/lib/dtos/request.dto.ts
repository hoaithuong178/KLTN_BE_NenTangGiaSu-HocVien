import {
  Grade,
  RequestType,
  SubjectClass,
  UserPost,
} from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ScheduleDTO {
  @IsDateString(
    {},
    {
      message: 'startTime: Thời gian bắt đầu không đúng định dạng',
    }
  )
  @IsNotEmpty({
    message: 'startTime: Thời gian bắt đầu không được để trống',
  })
  startTime!: string;

  @IsDateString(
    {},
    {
      message: 'endTime: Thời gian kết thúc không đúng định dạng',
    }
  )
  @IsNotEmpty({
    message: 'endTime: Thời gian kết thúc không được để trống',
  })
  endTime!: string;
}

export class CreateRequestRequest {
  @IsEnum(RequestType, {
    message: 'type: Loại yêu cầu không hợp lệ',
  })
  @IsNotEmpty({
    message: 'type: Loại yêu cầu không được để trống',
  })
  type!: RequestType;

  @IsString({
    message: 'toId: Người nhận phải là chuỗi',
  })
  @IsNotEmpty({
    message: 'toId: Người nhận không được để trống',
  })
  toId!: string;

  @IsNotEmpty({
    message: 'grade: Khối lớp không được để trống',
  })
  grade!: Grade;

  @IsArray({
    message: 'locations: Địa điểm phải là một mảng',
  })
  @IsString({ each: true, message: 'locations: Địa điểm phải là chuỗi' })
  @IsNotEmpty({
    message: 'locations: Địa điểm không được để trống',
  })
  locations!: string[];

  @IsNotEmpty({
    message: 'sessionPerWeek: Số buổi học mỗi tuần không được để trống',
  })
  @IsNumber(
    {},
    {
      message: 'sessionPerWeek: Số buổi học mỗi tuần phải là số',
    }
  )
  @Min(1, {
    message: 'sessionPerWeek: Số buổi học mỗi tuần phải lớn hơn 0',
  })
  sessionPerWeek!: number;

  @IsNotEmpty({
    message: 'duration: Thời lượng không được để trống',
  })
  @IsNumber(
    {},
    {
      message: 'duration: Thời lượng phải là số',
    }
  )
  @Min(1, {
    message: 'duration: Thời lượng phải lớn hơn 0',
  })
  duration!: number;

  @IsString({
    message: 'subjectId: Môn học không hợp lệ',
  })
  @IsNotEmpty({
    message: 'subjectId: Môn học không được để trống',
  })
  subjectId!: string;

  @IsArray({
    message: 'schedule: Lịch học phải là một mảng',
  })
  @ValidateNested({ each: true })
  @Type(() => ScheduleDTO)
  @IsNotEmpty({
    message: 'schedule: Lịch học không được để trống',
  })
  schedule!: ScheduleDTO[];

  @IsBoolean({
    message: 'mode: Hình thức học phải là boolean',
  })
  @IsNotEmpty({
    message: 'mode: Hình thức học không được để trống',
  })
  mode!: boolean;

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
}

export type CreateRequest = Omit<CreateRequestRequest, 'toId' | 'subjectId'> & {
  to: UserPost;
  subject: SubjectClass;
  from: UserPost;
};

export class UpdateRequestRequest extends CreateRequestRequest {
  //   @IsString()
  //   @IsNotEmpty({ message: 'id: ID yêu cầu không được để trống' })
  //   id!: string;
}

export type UpdateRequest = Omit<UpdateRequestRequest, 'toId' | 'subjectId'> & {
  to: UserPost;
  subject: SubjectClass;
  from: UserPost;
};

export interface RequestSearchRequest {
  fromUserId?: string;
  toUserId?: string;
  type?: RequestType;
  grade?: Grade;
  subject?: string;
  location?: string;
  mode?: boolean;
  minFeePerSession?: number;
  maxFeePerSession?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class GetRequestById {
  id!: string;
  userId!: string;
  role!: Role;
}

export class DeleteRequest extends GetRequestById {}
