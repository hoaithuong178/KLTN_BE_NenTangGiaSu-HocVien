import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Web3, { Contract } from 'web3';
import * as TeachMeContract from '../../assets/TeachMeContract.json';

@Injectable()
export class BlockchainRepository implements OnModuleInit {
  private readonly web3: Web3;
  private readonly contract: Contract<typeof TeachMeContract.abi>;
  private readonly logger = new Logger(BlockchainRepository.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 2000; // 2 giây

  constructor() {
    const rpcUrl = process.env.ETH_RPC_URL;
    this.web3 = new Web3(rpcUrl);
    this.contract = new this.web3.eth.Contract(
      TeachMeContract.abi,
      process.env.CONTRACT_ADDRESS
    );
  }

  async onModuleInit() {
    await this.connectWithRetry(0);
  }

  private async connectWithRetry(retryCount: number) {
    try {
      await this.web3.eth.getBlockNumber();
      this.logger.log('Kết nối blockchain thành công!');
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Không thể kết nối đến blockchain. Thử lại lần ${retryCount + 1}/${
            this.maxRetries
          } sau ${this.retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        this.logger.error(
          'Không thể kết nối đến blockchain sau nhiều lần thử lại'
        );
        throw error;
      }
    }
  }

  async getBalance(address: string) {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }
}
