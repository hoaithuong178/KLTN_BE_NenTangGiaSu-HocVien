import { TimeSlot } from '.prisma/education-service';
import { BaseResponse, CreateTimeSlot } from '@be/shared';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TimeSlotRepository } from '../repositories/timeSlot.repository';

@Injectable()
export class TimeSlotService {
  private readonly logger: Logger = new Logger(TimeSlotService.name);

  constructor(private readonly timeSlotRepository: TimeSlotRepository) {}

  async createTimeSlots(data: CreateTimeSlot[]) {
    this.logger.log('Creating time slots with data: ' + JSON.stringify(data));

    await this.timeSlotRepository.createTimeSlots(data);

    const timeSlots: TimeSlot[] =
      await this.timeSlotRepository.getTimeSlotsByUserId(data[0].userId);

    const response: BaseResponse<TimeSlot[]> = {
      statusCode: HttpStatus.CREATED,
      data: timeSlots,
    };

    return response;
  }

  async getTimeSlotsByUserId(userId: string) {
    this.logger.log('Getting time slots for user with ID: ' + userId);

    const timeSlots: TimeSlot[] =
      await this.timeSlotRepository.getTimeSlotsByUserId(userId);

    const response: BaseResponse<TimeSlot[]> = {
      statusCode: HttpStatus.OK,
      data: timeSlots,
    };

    return response;
  }

  async updateTimeSlot(id: string, data: CreateTimeSlot) {
    this.logger.log('Updating time slot with data: ' + JSON.stringify(data));

    await this.timeSlotRepository.updateTimeSlot(id, data);

    const response: BaseResponse<TimeSlot[]> = {
      statusCode: HttpStatus.OK,
      data: null,
    };

    return response;
  }

  async deleteTimeSlot(id: string, userId: string) {
    this.logger.log('Deleting time slot with ID: ' + id);

    const timeSlots: TimeSlot[] =
      await this.timeSlotRepository.getTimeSlotsByUserId(userId);
    await this.timeSlotRepository.deleteTimeSlot(id, userId);

    const response: BaseResponse<TimeSlot[]> = {
      statusCode: HttpStatus.OK,
      data: timeSlots,
    };

    return response;
  }
}
