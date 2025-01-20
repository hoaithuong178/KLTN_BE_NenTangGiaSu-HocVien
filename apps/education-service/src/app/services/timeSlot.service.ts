import { CreateTimeSlot } from '@be/shared';
import { Injectable, Logger } from '@nestjs/common';
import { TimeSlotRepository } from '../repositories/timeSlot.repository';

@Injectable()
export class TimeSlotService {
  private readonly logger: Logger = new Logger(TimeSlotService.name);

  constructor(private readonly timeSlotRepository: TimeSlotRepository) {}

  createTimeSlots(data: CreateTimeSlot[]) {
    this.logger.log('Creating time slots with data: ' + JSON.stringify(data));

    return this.timeSlotRepository.createTimeSlots(data);
  }

  getTimeSlotsByUserId(userId: string) {
    return this.timeSlotRepository.getTimeSlotsByUserId(userId);
  }
}
