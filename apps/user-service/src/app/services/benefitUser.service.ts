import { Injectable, Logger } from '@nestjs/common';
import { BenefitUserRepository } from '../repositories/benefitUser.repository';

@Injectable()
export class BenefitUserService {
  private readonly logger = new Logger(BenefitUserService.name);

  constructor(private readonly benefitUserRepository: BenefitUserRepository) {}

  async getUserBenefit(userId: string) {
    this.logger.log(`Getting user benefit for user ${userId}`);

    return this.benefitUserRepository.getUserBenefit(userId);
  }

  async connectUser(fromUserId: string, toUserId: string) {
    this.logger.log(`Connecting user ${fromUserId} to ${toUserId}`);

    return this.benefitUserRepository.connectUser(fromUserId, toUserId);
  }
}
