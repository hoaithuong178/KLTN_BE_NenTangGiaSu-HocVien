import {
  AuthRequest,
  CreateUserProfileReq,
  UpdateUserProfileReq,
} from '@be/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { UserProfileService } from '../services/userProfile.service';

@Controller('user-profiles')
export class UserProfileController {
  private readonly logger: Logger = new Logger(UserProfileController.name);

  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AuthGuard)
  async create(
    @Request() req: AuthRequest,
    @Body() data: CreateUserProfileReq,
    @UploadedFile() file?: Express.Multer.File
  ) {
    this.logger.log(
      `Create user profile for user ${req.user.id} with data ${JSON.stringify(
        data
      )}`
    );
    return this.userProfileService.create({
      ...data,
      avatar: file,
      id: req.user.id,
    });
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AuthGuard)
  async update(
    @Request() req: AuthRequest,
    @Body() data: UpdateUserProfileReq,
    @UploadedFile() file?: Express.Multer.File
  ) {
    this.logger.log(
      `Update user profile for user ${req.user.id} with data ${JSON.stringify(
        data
      )}`
    );
    return this.userProfileService.update(req.user.id, {
      ...data,
      avatar: file,
    });
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(@Request() req: AuthRequest) {
    this.logger.log(`Delete user profile for user ${req.user.id}`);
    return this.userProfileService.delete(req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async get(@Request() req: AuthRequest) {
    this.logger.log(`Get user profile for user ${req.user.id}`);
    return this.userProfileService.get(req.user.id);
  }

  @Patch('wallet-address')
  @UseGuards(AuthGuard)
  async updateWalletAddress(
    @Request() req: AuthRequest,
    @Body() data: { walletAddress: string }
  ) {
    this.logger.log(
      `Cập nhật địa chỉ ví cho người dùng ${req.user.id} với địa chỉ ${data.walletAddress}`
    );
    return this.userProfileService.updateWalletAddress(
      req.user.id,
      data.walletAddress
    );
  }
}
