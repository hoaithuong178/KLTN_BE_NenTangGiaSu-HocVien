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
    this.logger.log('Getting time slots for user with ID: ' + userId);

    return this.timeSlotRepository.getTimeSlotsByUserId(userId);
  }

  updateTimeSlot(id: string, data: CreateTimeSlot) {
    this.logger.log('Updating time slot with data: ' + JSON.stringify(data));

    return this.timeSlotRepository.updateTimeSlot(id, data);
  }

  deleteTimeSlot(id: string, userId: string) {
    this.logger.log('Deleting time slot with ID: ' + id);

    return this.timeSlotRepository.deleteTimeSlot(id, userId);
  }
}
