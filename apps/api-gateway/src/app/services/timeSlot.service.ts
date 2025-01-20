import { CreateTimeSlot } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TimeSlotService {
  constructor(
    @Inject('EDUCATION_SERVICE') private readonly timeSlotService: ClientProxy
  ) {}

  createTimeSlots(data: CreateTimeSlot[]) {
    return this.timeSlotService
      .send({ cmd: 'create-time-slots' }, data)
      .toPromise();
  }

  getTimeSlotsByUserId(userId: string) {
    return this.timeSlotService
      .send({ cmd: 'get-time-slots-by-user-id' }, userId)
      .toPromise();
  }

  updateTimeSlot(id: string, data: CreateTimeSlot) {
    return this.timeSlotService
      .send({ cmd: 'update-time-slot' }, { id, data })
      .toPromise();
  }

  deleteTimeSlot(id: string, userId: string) {
    return this.timeSlotService
      .send({ cmd: 'delete-time-slot' }, { id, userId })
      .toPromise();
  }
}
