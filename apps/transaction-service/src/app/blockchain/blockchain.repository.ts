import { Grade } from '.prisma/education-service';
import { BenefitPackagePurchasedEvent, CreateContractEvent } from '@be/shared';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import Web3, { Contract } from 'web3';
import * as TeachMeContract from '../../assets/TeachMeContract.json';

@Injectable()
export class BlockchainRepository implements OnModuleInit {
  private readonly web3: Web3;
  private readonly contract: Contract<typeof TeachMeContract.abi>;
  private readonly logger = new Logger(BlockchainRepository.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 2000; // 2 giây

  constructor(
    @Inject('BLOCKCHAIN_CONTRACT_SERVICE')
    private readonly contractClient: ClientProxy,
    @Inject('BLOCKCHAIN_CLASS_SERVICE')
    private readonly classClient: ClientProxy,
    @Inject('BLOCKCHAIN_USER_SERVICE')
    private readonly userClient: ClientProxy
  ) {
    const wsUrl = process.env.ETH_WS_URL;

    this.web3 = new Web3(wsUrl);
    this.contract = new this.web3.eth.Contract(
      TeachMeContract.abi,
      process.env.CONTRACT_ADDRESS
    );
  }

  async onModuleInit() {
    await this.connectWithRetry(0);
    this.listenToContractEvents();
    this.listenToBenefitPackagePurchasedEvents();
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

  private async publicEvent<T>(
    data: T,
    pattern: string,
    ...queues: ClientProxy[]
  ) {
    for (const queue of queues) {
      let retryCount = 0;
      let success = false;

      while (!success && retryCount < this.maxRetries) {
        try {
          await new Promise<void>((resolve, reject) => {
            queue.emit(pattern, data).subscribe({
              next: () => {
                this.logger.log(
                  `Event với data ${JSON.stringify(
                    data
                  )} đã được publish thành công`
                );
                success = true;
                resolve();
              },
              error: (error) => {
                this.logger.error(
                  `Lỗi khi publish event với data ${JSON.stringify(
                    data
                  )} (lần thử ${retryCount + 1}/${this.maxRetries}):`,
                  error
                );
                reject(new Error(error));
              },
            });
          });
        } catch (error) {
          this.logger.error(
            `Lỗi khi publish event với data ${JSON.stringify(data)} (lần thử ${
              retryCount + 1
            }/${this.maxRetries}):`,
            error
          );

          retryCount++;
          if (retryCount < this.maxRetries) {
            this.logger.warn(
              `Thử lại publish event sau ${this.retryDelay}ms...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, this.retryDelay)
            );
          } else {
            this.logger.error(
              `Không thể publish event sau ${this.maxRetries} lần thử`
            );
          }
        }
      }
    }
  }

  private async listenToContractEvents() {
    this.logger.log('Bắt đầu lắng nghe sự kiện ContractCreated...');

    const subscription = this.contract.events.ContractCreated({
      fromBlock: 'latest',
    });

    subscription.on('data', (event) => {
      const returnValues = event.returnValues;
      const data: CreateContractEvent = {
        contractId: returnValues.id as string,
        studentId: returnValues.studentId as string,
        tutorId: returnValues.tutorId as string,
        classId: returnValues.classId as string,
        startDate: Number(returnValues.startDate),
        endDate: Number(returnValues.endDate),
        depositAmount: Number(returnValues.depositAmount),
        totalAmount: Number(returnValues.totalAmount),
        feePerSession: Number(returnValues.feePerSession),
        feePerHour: Number(returnValues.feePerHour),
        totalFee: Number(returnValues.totalFee),
        grade: returnValues.grade as Grade,
        subject: returnValues.subject as string,
        mode: returnValues.mode as boolean,
        schedules: returnValues.schedules as string[],
      };

      this.logger.log(
        `Nhận được sự kiện ContractCreated mới: ${JSON.stringify(data)}`
      );

      this.publicEvent(
        data,
        'contract.created',
        this.contractClient,
        this.classClient
      );
    });

    subscription.on('error', (error) => {
      this.logger.error('Lỗi khi lắng nghe sự kiện ContractCreated:', error);
    });
  }

  private async listenToBenefitPackagePurchasedEvents() {
    this.logger.log('Bắt đầu lắng nghe sự kiện BenefitPackagePurchased...');

    const subscription = this.contract.events.BenefitPackagePurchased({
      fromBlock: 'latest',
    });

    subscription.on('data', (event) => {
      const returnValues = event.returnValues;
      const data: BenefitPackagePurchasedEvent = {
        id: returnValues.id as string,
        userId: returnValues.userId as string,
        benefitId: returnValues.benefitId as string,
        amount: Number(returnValues.amount) / 10 ** 18,
        quantity: Number(returnValues.quantity),
        priceRate: Number(returnValues.priceRate),
      };

      this.logger.log(
        `Nhận được sự kiện BenefitPackagePurchased mới: ${JSON.stringify(data)}`
      );

      this.publicEvent(
        data,
        'benefit.purchased',
        this.contractClient,
        this.userClient
      );
    });

    subscription.on('error', (error) => {
      this.logger.error(
        'Lỗi khi lắng nghe sự kiện BenefitPackagePurchased:',
        error
      );
    });
  }

  async checkPastEvents() {
    try {
      const events = await this.contract.getPastEvents('ALLEVENTS', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      this.logger.log(
        `Tìm thấy ${events.length} sự kiện ContractCreated trong quá khứ`
      );
      return events;
    } catch (error) {
      this.logger.error('Lỗi khi truy vấn sự kiện trong quá khứ:', error);
      throw error;
    }
  }

  async getBalance(address: string) {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async getETHFromBitGet() {
    const response = await fetch(process.env.BIT_GET_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fiat: 'VND',
        includeFiatRate: true,
        languageType: 0,
        name: 'Ethereum',
        normalizedName: 'ethereum',
      }),
    });

    if (!response.ok) throw new RpcException('Error getETHFromBitGet');

    const result = await response.json();
    const price = Math.round(
      result.data.fiatExchangeRate.usdRate * result.data.price
    );

    return price;
  }

  async getETHFromBitKan() {
    const response = await fetch(process.env.BIT_KAN_API);

    if (!response.ok) throw new RpcException('Error getETHFromBitKan');

    const result = await response.json();

    return (1 / result.data.ETH) * result.data.VND;
  }
}
