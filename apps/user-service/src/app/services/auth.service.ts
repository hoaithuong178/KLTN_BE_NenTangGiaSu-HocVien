import { CreateUser, ErrorDetail } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly userRepository: UserRepository) {}

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

    return this.userRepository.createUser({
      ...data,
      password: hashPassword,
    });
  }
}
