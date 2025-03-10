import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvalidTokenRepository } from '../repositories/invalidToken.repository';

@Injectable()
export class CleanupTokenService {
  private readonly logger = new Logger(CleanupTokenService.name);

  constructor(
    private readonly invalidTokenRepository: InvalidTokenRepository
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'cleanup-expired-tokens',
  })
  async cleanupExpiredTokens() {
    try {
      const result =
        await this.invalidTokenRepository.deleteExpiredInvalidTokens();

      this.logger.log(`Đã xóa ${result.count} invalid token đã hết hạn`);
    } catch (error) {
      this.logger.error('Lỗi khi xóa invalid token:', error);
    }
  }
}
