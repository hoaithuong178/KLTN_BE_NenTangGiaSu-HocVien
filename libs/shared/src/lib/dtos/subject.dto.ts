import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString({
    message: 'name: Tên môn học phải là chuỗi',
  })
  @IsNotEmpty({
    message: 'name: Tên môn học không được để trống',
  })
  @MinLength(2, {
    message: 'name: Tên môn học phải có ít nhất 2 ký tự',
  })
  @MaxLength(50, {
    message: 'name: Tên môn học không được vượt quá 50 ký tự',
  })
  name!: string;
}
