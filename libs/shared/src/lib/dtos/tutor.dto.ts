import { LearningType, TutorLevel } from '.prisma/user-service';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTutorReq {
  @IsArray({
    message: 'specializations: Chuyên môn phải là một mảng',
  })
  @ArrayNotEmpty({
    message: 'specializations: Chuyên môn không được để trống',
  })
  @IsString({
    each: true,
    message: 'specializations: Mỗi chuyên môn phải là chuỗi ký tự',
  })
  specializations!: string[];

  @IsNumber(
    {},
    {
      message: 'experiences: Số năm kinh nghiệm phải là số',
    }
  )
  @Min(0, {
    message: 'experiences: Số năm kinh nghiệm phải lớn hơn hoặc bằng 0',
  })
  experiences!: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'taughtStudentsCount: Số lượng học sinh đã dạy phải là số',
    }
  )
  taughtStudentsCount?: number;

  @IsArray({
    message: 'tutorLocations: Địa điểm dạy phải là một mảng',
  })
  @ArrayNotEmpty({
    message: 'tutorLocations: Địa điểm dạy không được để trống',
  })
  @IsString({
    each: true,
    message: 'tutorLocations: Mỗi địa điểm dạy phải là chuỗi ký tự',
  })
  tutorLocations!: string[];

  @IsNumber(
    {},
    {
      message: 'hourlyPrice: Giá theo giờ phải là số',
    }
  )
  @Min(0, {
    message: 'hourlyPrice: Giá theo giờ phải lớn hơn hoặc bằng 0',
  })
  hourlyPrice!: number;

  @IsNumber(
    {},
    {
      message: 'fee: Phí phải là số',
    }
  )
  @Min(0, {
    message: 'fee: Phí phải lớn hơn hoặc bằng 0',
  })
  fee!: number;

  @IsString({
    message: 'level: Trình độ không hợp lệ',
  })
  @IsNotEmpty({
    message: 'level: Trình độ không được để trống',
  })
  @IsIn(
    [
      'L1',
      'L2',
      'L3',
      'L4',
      'L5',
      'L6',
      'L7',
      'L8',
      'L9',
      'L10',
      'L11',
      'L12',
      'UNIVERSITY',
      'COLLAGE',
      'HIGH_SCHOOL',
    ],
    {
      message:
        'level: Trình độ phải là một trong các giá trị: L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11, L12, UNIVERSITY, COLLAGE, HIGH_SCHOOL',
    }
  )
  level!: TutorLevel;

  @IsArray({
    message: 'learningTypes: Hình thức học phải là một mảng',
  })
  @ArrayNotEmpty({
    message: 'learningTypes: Hình thức học không được để trống',
  })
  @IsString({
    each: true,
    message: 'learningTypes: Mỗi hình thức học phải là chuỗi ký tự',
  })
  @IsIn(['ONLINE', 'OFFLINE'], {
    each: true,
    message:
      'learningTypes: Mỗi hình thức học phải là một trong các giá trị: ONLINE, OFFLINE',
  })
  learningTypes!: LearningType[];

  @IsString({
    message: 'description: Mô tả không được để trống',
  })
  description!: string;

  @IsArray({
    message: 'freeTime: Thời gian rảnh phải là một mảng',
  })
  @ArrayNotEmpty({
    message: 'freeTime: Thời gian rảnh không được để trống',
  })
  @IsString({
    each: true,
    message: 'freeTime: Mỗi thời gian rảnh phải là chuỗi ký tự',
  })
  freeTime!: string[];

  @IsString({
    message: 'qualification: Bằng cấp phải là chuỗi ký tự',
  })
  @IsNotEmpty({
    message: 'qualification: Bằng cấp không được để trống',
  })
  qualification!: string;
}

export class CreateTutor extends CreateTutorReq {
  id!: string;
}

export class SearchTutor {
  specialization?: string;
  location?: string;
  fromPrice?: number;
  toPrice?: number;
  gender?: string;
  level?: TutorLevel;
  rating?: number;
  learningType?: LearningType;
  page?: number;
  limit?: number;
}
