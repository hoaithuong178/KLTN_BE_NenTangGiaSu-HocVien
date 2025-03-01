import { Grade, UserPost } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
export class Schedule {
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

export class CreatePostRequest {
  @IsString({
    message: 'title: Tiêu đề không hợp lệ',
  })
  @IsNotEmpty({
    message: 'title: Tiêu đề không được để trống',
  })
  title!: string;

  @IsString({
    message: 'content: Nội dung không hợp lệ',
  })
  @IsNotEmpty({
    message: 'content: Nội dung không được để trống',
  })
  content!: string;

  @IsDateString(
    {},
    {
      message: 'postTime: Thời gian đăng bài không đúng định dạng',
    }
  )
  @IsNotEmpty({
    message: 'postTime: Thời gian đăng bài không được để trống',
  })
  postTime!: string;

  @IsArray({
    message: 'schedule: Lịch học phải là một mảng',
  })
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  @IsNotEmpty({
    message: 'schedule: Lịch học không được để trống',
  })
  schedule!: Schedule[];

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
    message: 'subject: Môn học không hợp lệ',
  })
  @IsNotEmpty({
    message: 'subject: Môn học không được để trống',
  })
  subject!: string;

  @IsArray({
    message: 'requirements: Yêu cầu phải là một mảng',
  })
  @IsString({ each: true, message: 'requirements: Yêu cầu phải là chuỗi' })
  @IsNotEmpty({
    message: 'requirements: Yêu cầu không được để trống',
  })
  requirements!: string[];

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

export class CreatePost extends CreatePostRequest {
  user!: UserPost;
}

export class DeletePostRequest {
  postId!: string;
  userId!: string;
  role!: Role;
}
