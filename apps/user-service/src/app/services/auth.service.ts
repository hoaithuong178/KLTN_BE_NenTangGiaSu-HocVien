import { AuthResponse, CreateUser, ErrorDetail, Login } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt.util';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly userRepository: UserRepository) {}

  createAuthResponse(user: User): AuthResponse {
    return {
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };
  }

  async createUser(data: CreateUser) {
    this.logger.log('Creating user with data: ' + JSON.stringify(data));

    const [email, phone] = await Promise.all([
      this.userRepository.findUserByEmail(data.email),
      this.userRepository.findUserByPhone(data.phone),
    ]);

    if (phone || email) {
      const details: Array<ErrorDetail> = [];

      if (phone) {
        details.push({
          field: 'phone',
          message: 'Số điện thoại đã tồn tại',
        });
      }

      if (email) {
        details.push({
          field: 'email',
          message: 'Email đã tồn tại',
        });
      }

      throw new RpcException({
        statusCode: 409,
        message: 'Thông tin đã tồn tại',
        success: false,
        details,
      });
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      ...data,
      password: hashPassword,
    });

    return this.createAuthResponse(user);
  }

  async login({ email, password }: Login) {
    this.logger.log('Logging in with email: ' + email);

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'Email không tồn tại',
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Mật khẩu không chính xác',
        success: false,
      });
    }

    return this.createAuthResponse(user);
  }
}
