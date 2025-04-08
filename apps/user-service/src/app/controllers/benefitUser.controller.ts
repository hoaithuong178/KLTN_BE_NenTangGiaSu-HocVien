import { BenefitPackagePurchasedEvent, ExistedError } from '@be/shared';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BenefitUserService } from '../services/benefitUser.service';

@Controller('benefit-users')
export class BenefitUserController {
  private readonly logger = new Logger(BenefitUserController.name);

  constructor(private readonly benefitUserService: BenefitUserService) {}

  @EventPattern('benefit.purchased')
  async handleBenefitPurchased(
    @Payload() event: BenefitPackagePurchasedEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `BenefitUser Controller nhận được sự kiện benefit purchased: ${JSON.stringify(
          event
        )}`
      );

      const benefitUser = await this.benefitUserService.findByEventId(event.id);

      if (benefitUser) {
        throw new ExistedError('Benefit user đã tồn tại');
      }

      await this.benefitUserService.upsertBenefitUser({
        eventId: event.id,
        remaining: event.quantity,
        userId: event.userId,
      });

      channel.ack(originalMsg);
      return event;
    } catch (error) {
      this.logger.error(
        'BenefitUser Controller - Lỗi khi xử lý benefit purchased event:',
        error
      );

      if (error instanceof ExistedError) channel.ack(originalMsg);
      else channel.nack(originalMsg, false, true);

      throw error;
    }
  }
}
