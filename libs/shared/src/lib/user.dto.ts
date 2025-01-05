import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUser {
  @IsString({
    message: 'Họ tên không hợp lệ',
  })
  @IsNotEmpty({
    message: 'Họ tên không được để trống',
  })
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
