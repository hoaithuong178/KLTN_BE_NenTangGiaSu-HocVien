import { Injectable, Logger } from '@nestjs/common';
import Redis from '../configs/redis.config';
import { BenefitUserRepository } from '../repositories/benefitUser.repository';
import { CreateBenefitUser } from '../types';

@Injectable()
export class BenefitUserService {
  private readonly logger = new Logger(BenefitUserService.name);

  constructor(private readonly benefitUserRepository: BenefitUserRepository) {}

  async getUserBenefit(userId: string) {
    this.logger.log(`Getting user benefit for user ${userId}`);

    const USER_BENEFIT_KEY = `user-benefit::${userId}`;
    const userBenefitCached = await Redis.getInstance()
      .getClient()
      .get(USER_BENEFIT_KEY);

    if (userBenefitCached) return JSON.parse(userBenefitCached);

    const userBenefit = await this.benefitUserRepository.getUserBenefit(userId);

    Redis.getInstance()
      .getClient()
      .set(USER_BENEFIT_KEY, JSON.stringify(userBenefit));

    return userBenefit;
  }

  async connectUser(fromUserId: string, toUserId: string) {
    this.logger.log(`Connecting user ${fromUserId} to ${toUserId}`);

    return this.benefitUserRepository.connectUser(fromUserId, toUserId);
  }

  async upsertBenefitUser(data: CreateBenefitUser) {
    this.logger.log(`Upsert benefit user ${data.userId}`);

    return this.benefitUserRepository.upsertBenefitUser(data);
  }

  async findByEventId(eventId: string) {
    this.logger.log(`Finding benefit user by event id ${eventId}`);

    return this.benefitUserRepository.findByEventId(eventId);
  }
}
