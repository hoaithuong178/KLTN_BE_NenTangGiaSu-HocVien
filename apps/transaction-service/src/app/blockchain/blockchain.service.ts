import { BaseResponse } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BlockchainRepository } from './blockchain.repository';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(private readonly blockchainRepository: BlockchainRepository) {}

  async getBalance(address: string) {
    try {
      const balance = await this.blockchainRepository.getBalance(address);

      const response: BaseResponse<string> = {
        data: balance,
        statusCode: 200,
      };

      return response;
    } catch (error) {
      this.logger.error(`Lỗi khi lấy số dư của địa chỉ ${address}:`, error);
      throw new RpcException(`Lỗi khi lấy số dư của địa chỉ ${address}`);
    }
  }
}
