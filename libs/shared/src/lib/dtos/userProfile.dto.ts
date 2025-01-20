import { Gender } from '.prisma/user-service';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserProfileReq {
  @IsOptional()
  @IsString({
    message: 'idCardNumber: Số CMND không hợp lệ',
  })
  idCardNumber?: string;

  @IsOptional()
  @IsString({
    message: 'address: Địa chỉ không hợp lệ',
  })
  address?: string;

  @IsDateString(
    {},
    {
      message: 'dob: Ngày sinh không hợp lệ',
    }
  )
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: 'dob: Ngày sinh phải có định dạng YYYY-MM-DD',
  })
  dob!: string;

  @IsString({
    message: 'geder: Giới tính không hợp lệ',
  })
  @IsNotEmpty({
    message: 'gender: Giới tính không được để trống',
  })
  @IsIn(['MALE', 'FEMALE', 'OTHER'], {
    message: 'gender: Giới tính phải là MALE, FEMLAE hoặc OTHER',
  })
  gender!: Gender;
}

export class CreateUserProfile extends CreateUserProfileReq {
  @IsOptional()
  avatar?: Express.Multer.File;

  id!: string;
}

export type UpdateUserProfileReq = Partial<CreateUserProfileReq>;
export type UpdateUserProfile = Partial<CreateUserProfile>;
