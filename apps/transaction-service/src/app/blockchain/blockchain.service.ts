import { BaseResponse } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import Redis from '../configs/redis.config';
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

  async getCoinPrice() {
    this.logger.log('Get coin price service');

    try {
      const res = await Redis.getInstance().getClient().get(`coin-eth-vnd`);

      if (res)
        return {
          data: parseFloat(res),
          statusCode: 200,
        };

      const [priceBitGet, priceBitKan] = await Promise.allSettled([
        this.blockchainRepository.getETHFromBitGet(),
        this.blockchainRepository.getETHFromBitKan(),
      ]);

      let price = -1;
      if (priceBitGet.status === 'fulfilled') {
        price = priceBitGet.value;
      } else if (priceBitKan.status === 'fulfilled') {
        price = priceBitKan.value;
      }

      if (price === -1) throw new RpcException('Error getCoinPriceService');

      Redis.getInstance()
        .getClient()
        .set(`coin-eth-vnd`, price.toString(), {
          EX: 60, // 1 minute
        })
        .then(() => console.log('Coin price has been saved to Redis.'))
        .catch((error) => {
          console.error('Error set redis:', error);
        });

      const response: BaseResponse<number> = {
        data: price,
        statusCode: 200,
      };

      return response;
    } catch (error) {
      console.error('Error getCoinPriceService:', error);
      throw error;
    }
  }
}
