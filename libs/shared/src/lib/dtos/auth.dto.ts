import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateUser } from './user.dto';

export class Login {
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
}

export class AuthResponse {
  accessToken!: string;
  refreshToken!: string;
}

export class JWTInput {
  email!: string;
  id!: string;
  role!: string;
  jwtId!: string;
}

export class JWTResponse extends JWTInput {
  exp!: number;
}

export class AuthRequest {
  user!: JWTResponse;
}

export class OTPRegister {
  @IsString({
    message: 'Email không hợp lệ',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    }
  )
  email!: string;
}

export class Register extends CreateUser {
  @IsString({
    message: 'otp: OTP không hợp lệ',
  })
  @IsNotEmpty({
    message: 'otp: OTP không được để trống',
  })
  @Matches(/^[0-9]{6}$/, {
    message: 'otp: OTP phải có 6 chữ số',
  })
  otp!: string;
}

export class Logout {
  id!: string;
  expiredAt!: Date;
  refreshToken!: string;
}
