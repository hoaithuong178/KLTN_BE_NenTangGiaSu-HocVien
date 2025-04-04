import { CreateContractEvent, ExistedError } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ContractRepository } from './contract.repository';

@Injectable()
export class ContractService {
  private readonly logger: Logger = new Logger(ContractService.name);

  constructor(private readonly contractRepository: ContractRepository) {}

  async createContract(data: CreateContractEvent) {
    this.logger.log(
      `Contract Service - Creating contract: ${JSON.stringify(data)}`
    );

    try {
      const classData = await this.contractRepository.findById(data.classId);

      if (classData) {
        throw new ExistedError('Hợp đồng đã tồn tại');
      }

      const createdClass = await this.contractRepository.createContract({
        classId: data.classId,
        depositAmount: data.depositAmount,
        endDate: new Date(data.endDate * 1000),
        feePerSession: data.feePerSession,
        id: data.contractId,
        startDate: new Date(data.startDate * 1000),
        studentId: data.studentId,
        tutorId: data.tutorId,
        totalAmount: data.totalAmount,
      });

      return createdClass;
    } catch (error) {
      throw new RpcException(error.message || 'Lỗi khi tạo lớp học từ sự kiện');
    }
  }

  findById(id: string) {
    this.logger.log(`Contract Service - Finding contract by id: ${id}`);

    return this.contractRepository.findById(id);
  }

  async findByUserId(userId: string) {
    this.logger.log(
      `Contract Service - Finding contracts by user id: ${userId}`
    );

    try {
      const contracts = await this.contractRepository.findByUserId(userId);
      return contracts;
    } catch (error) {
      throw new RpcException(
        error.message || 'Lỗi khi tìm hợp đồng theo người dùng'
      );
    }
  }

  async getAllContracts() {
    this.logger.log(`Contract Service - Fetching all contracts`);

    return await this.contractRepository.getAllContracts();
  }
}
