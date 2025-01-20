import { CreateTimeSlot } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TimeSlotService } from '../services/timeSlot.service';

@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @MessagePattern({ cmd: 'create-time-slots' })
  createTimeSlots(data: CreateTimeSlot[]) {
    return this.timeSlotService.createTimeSlots(data);
  }

  @MessagePattern({ cmd: 'get-time-slots-by-user-id' })
  getTimeSlotsByUserId(userId: string) {
    return this.timeSlotService.getTimeSlotsByUserId(userId);
  }
}
