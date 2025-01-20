import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTimeSlotReq {
  @IsString({ message: 'Thời gian bắt đầu phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message: 'Thời gian bắt đầu phải theo định dạng ISO 8601',
  })
  startTime!: string;

  @IsString({ message: 'Thời gian kết thúc phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Thời gian kết thúc không được để trống' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message: 'Thời gian kết thúc phải theo định dạng ISO 8601',
  })
  endTime!: string;
}

export class CreateTimeSlot extends CreateTimeSlotReq {
  userId!: string;
}
