import { User } from '.prisma/user-service';
import {
  AuthResponse,
  BaseResponse,
  ErrorDetail,
  generateAccessToken,
  generateRefreshToken,
  JWTInput,
  Login,
  Register,
} from '@be/shared';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import sendEmail from '../configs/email.config';
import otp from '../configs/otp.config';
import Redis from '../configs/redis.config';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @Inject('EDUCATION_SERVICE') private readonly educationService: ClientProxy
  ) {}

  async createAuthResponse(user: User) {
    const userData: JWTInput = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const response: BaseResponse<AuthResponse> = {
      statusCode: HttpStatus.OK,
      data: {
        accessToken: generateAccessToken(userData),
        refreshToken: generateRefreshToken(userData),
      },
    };

    return response;
  }

  async createUser({ otp, ...data }: Register) {
    this.logger.log('Creating user with data: ' + JSON.stringify(data));

    const [email, phone, otpCode] = await Promise.all([
      this.userRepository.findUserByEmail(data.email),
      this.userRepository.findUserByPhone(data.phone),
      Redis.getInstance().getClient().get(data.email),
    ]);

    this.logger.log(`OTP code: ${otpCode}`);
    const isValidOtp = otpCode === otp;

    if (phone || email || !isValidOtp) {
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

      if (!isValidOtp) {
        details.push({
          field: 'otp',
          message: 'Mã OTP không hợp lệ',
        });
      }

      throw new RpcException({
        statusCode: 409,
        message: details.reduce(
          (acc, cur) => [...acc, `${cur.field}: ${cur.message}`],
          []
        ),
        success: false,
        details,
      });
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      ...data,
      password: hashPassword,
    });

    lastValueFrom(this.educationService.send({ cmd: 'user-create-user' }, user))
      .then(() => {
        console.log('User created in education service');
      })
      .catch((err) => {
        console.error(err);
      });

    return this.createAuthResponse(user);
  }

  async login({ email, password }: Login) {
    this.logger.log('Logging in with email: ' + email);

    const user = await this.userRepository.login(email);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: ['email: Email không tồn tại'],
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: ['password: Mật khẩu không chính xác'],
        success: false,
      });
    }

    return this.createAuthResponse(user);
  }

  async otpRegister(email: string) {
    this.logger.log(`Sending OTP to email: ${email}`);

    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new RpcException({
        statusCode: 409,
        message: ['email: Email đã tồn tại'],
      });
    }

    const otpCode = otp.generate();

    await Promise.all([
      sendEmail({
        receiver: email,
        locals: {
          appLink: process.env.FE_URL,
          OTP: otpCode,
          title: 'OTP Verification',
        },
        subject: 'OTP Verification',
        template: 'verifyEmail',
      }),
      Redis.getInstance()
        .getClient()
        .set(email, otpCode, {
          EX: 60 * 5,
        }),
    ]);

    Logger.log(`OTP code: ${otpCode}`);

    const response: BaseResponse<string> = {
      statusCode: HttpStatus.OK,
      data: 'OTP đã được gửi',
    };

    return response;
  }
}
