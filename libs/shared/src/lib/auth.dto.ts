import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AuthResponse {
  accessToken!: string;
  refreshToken!: string;
}

export class JWTInput {
  email!: string;
  id!: string;
}

export class AuthRequest {
  user!: JWTInput;
}
