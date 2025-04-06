import {
  BaseResponse,
  CreateBenefitDto,
  PRISMA_ERROR_CODE,
  UpdateBenefitDto,
} from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BenefitRepository } from '../repositories/benefit.repository';

@Injectable()
export class BenefitService {
  private readonly logger: Logger = new Logger(BenefitService.name);

  constructor(private readonly benefitRepository: BenefitRepository) {}

  async create(createBenefitDto: CreateBenefitDto) {
    this.logger.log(`Creating benefit: ${JSON.stringify(createBenefitDto)}`);

    const benefit = await this.benefitRepository.create(createBenefitDto);

    const response: BaseResponse<typeof benefit> = {
      statusCode: HttpStatus.CREATED,
      data: benefit,
    };

    return response;
  }

  async findAll() {
    this.logger.log('Finding all benefits');

    const benefits = await this.benefitRepository.findAll();

    const response: BaseResponse<typeof benefits> = {
      statusCode: HttpStatus.OK,
      data: benefits ?? [],
    };

    return response;
  }

  async findOne(id: string) {
    this.logger.log(`Finding benefit by id: ${id}`);

    const benefit = await this.benefitRepository.findOne(id);

    if (!benefit) {
      throw new RpcException('Benefit not found');
    }

    const response: BaseResponse<typeof benefit> = {
      statusCode: HttpStatus.OK,
      data: benefit,
    };

    return response;
  }

  async update(id: string, updateBenefitDto: UpdateBenefitDto) {
    this.logger.log(
      `Updating benefit by id: ${id} with data: ${JSON.stringify(
        updateBenefitDto
      )}`
    );

    try {
      const benefit = await this.benefitRepository.update(id, updateBenefitDto);

      const response: BaseResponse<typeof benefit> = {
        statusCode: HttpStatus.OK,
        data: benefit,
      };

      return response;
    } catch (error) {
      if (error.code === PRISMA_ERROR_CODE.RECORD_UPDATE_NOT_FOUND) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Benefit not found',
        });
      }

      throw new RpcException(error);
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting benefit by id: ${id}`);

    const benefit = await this.benefitRepository.updateStatus(id, true);

    const response: BaseResponse<typeof benefit> = {
      statusCode: HttpStatus.OK,
      data: benefit,
    };

    return response;
  }
}
