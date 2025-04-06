import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBenefitDto {
  @IsString({
    message: 'name: Tên benefit không hợp lệ',
  })
  @IsNotEmpty({
    message: 'name: Tên benefit không được để trống',
  })
  name!: string;

  @IsString({
    message: 'description: Mô tả không hợp lệ',
  })
  @IsOptional()
  description?: string;

  @IsNumber(
    {},
    {
      message: 'quantity: Số lượng phải là số',
    }
  )
  @IsNotEmpty({
    message: 'quantity: Số lượng không được để trống',
  })
  quantity!: number;

  @IsNumber(
    {},
    {
      message: 'amount: Giá trị phải là số',
    }
  )
  @IsNotEmpty({
    message: 'amount: Giá trị không được để trống',
  })
  amount!: number;
}

export type UpdateBenefitDto = Partial<CreateBenefitDto>;
