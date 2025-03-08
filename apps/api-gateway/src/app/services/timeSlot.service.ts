import { CreateTimeSlot } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TimeSlotService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly timeSlotService: ClientProxy
  ) {}

  createTimeSlots(data: CreateTimeSlot[]) {
    return lastValueFrom(
      this.timeSlotService.send({ cmd: 'create-time-slots' }, data)
    );
  }

  getTimeSlotsByUserId(userId: string) {
    return lastValueFrom(
      this.timeSlotService.send({ cmd: 'get-time-slots-by-user-id' }, userId)
    );
  }

  updateTimeSlot(id: string, data: CreateTimeSlot) {
    return lastValueFrom(
      this.timeSlotService.send({ cmd: 'update-time-slot' }, { id, data })
    );
  }

  deleteTimeSlot(id: string, userId: string) {
    return lastValueFrom(
      this.timeSlotService.send({ cmd: 'delete-time-slot' }, { id, userId })
    );
  }
}
