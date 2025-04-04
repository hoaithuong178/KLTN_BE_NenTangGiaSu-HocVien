import { Role } from '.prisma/education-service';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLesson {
  @IsString({
    message: 'classId: ID lớp học không hợp lệ',
  })
  @IsNotEmpty({
    message: 'classId: ID lớp học không được để trống',
  })
  @IsUUID('4', {
    message: 'classId: ID lớp học phải là UUID',
  })
  classId!: string;

  @IsNotEmpty({
    message: 'startTime: Thời gian bắt đầu không được để trống',
  })
  @Type(() => Date)
  @IsDate({
    message: 'startTime: Thời gian bắt đầu không hợp lệ',
  })
  startTime!: Date;

  @IsNotEmpty({
    message: 'endTime: Thời gian kết thúc không được để trống',
  })
  @Type(() => Date)
  @IsDate({
    message: 'endTime: Thời gian kết thúc không hợp lệ',
  })
  endTime!: Date;

  @IsString({
    message: 'content: Nội dung không hợp lệ',
  })
  @IsNotEmpty({
    message: 'content: Nội dung không được để trống',
  })
  content!: string;

  @IsString({
    message: 'location: Địa điểm không hợp lệ',
  })
  @IsNotEmpty({
    message: 'location: Địa điểm không được để trống',
  })
  location!: string;
}

export type UpdateLesson = Partial<Omit<CreateLesson, 'classId'>>;

export class CheckInLesson {
  lessonId!: string;
  userId!: string;
  role!: Role;
}
