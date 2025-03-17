import { Role, User } from '.prisma/user-service';
import { IsEmail, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUser {
  @IsString({
    message: 'name: Họ tên không hợp lệ',
  })
  @IsNotEmpty({
    message: 'name: Họ tên không được để trống',
  })
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'name: Họ tên chỉ được chứa chữ cái và khoảng trắng',
  })
  name!: string;

  @IsString({
    message: 'phone: Số điện thoại không hợp lệ',
  })
  @IsNotEmpty({
    message: 'phone: Số điện thoại không được để trống',
  })
  @Matches(/^\d{10}$/, {
    message: 'phone: Số điện thoại phải có 10 chữ số',
  })
  phone!: string;

  @IsString({
    message: 'email: Email không hợp lệ',
  })
  @IsNotEmpty({
    message: 'email: Email không được để trống',
  })
  @IsEmail(
    {},
    {
      message: 'email: Email không đúng định dạng',
    }
  )
  email!: string;

  @IsString({
    message: 'password: Mật khẩu không hợp lệ',
  })
  @IsNotEmpty({
    message: 'password: Mật khẩu không được để trống',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password: Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số',
  })
  password!: string;

  @IsString({
    message: 'role: Vai trò không hợp lệ',
  })
  @IsNotEmpty({
    message: 'role: Vai trò không được để trống',
  })
  @IsIn(['TUTOR', 'STUDENT', 'ADMIN'], {
    message:
      'role: Vai trò phải là một trong các giá trị: TUTOR, STUDENT, ADMIN',
  })
  role!: Role;
}

export type UserBase = {
  id: string;
  name?: string;
  avatar?: string;
};

export type UserWithAvatar = User & {
  avatar: string | null;
};
