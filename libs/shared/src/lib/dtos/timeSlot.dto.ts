import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTimeSlotReq {
  @IsString({ message: 'startTime: Thời gian bắt đầu phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'startTime: Thời gian bắt đầu không được để trống' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message: 'startTime: Thời gian bắt đầu phải theo định dạng ISO 8601',
  })
  startTime!: string;

  @IsString({ message: 'endTime: Thời gian kết thúc phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'endTime: Thời gian kết thúc không được để trống' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message: 'endTime: Thời gian kết thúc phải theo định dạng ISO 8601',
  })
  endTime!: string;
}

export class CreateTimeSlot extends CreateTimeSlotReq {
  userId!: string;
}
