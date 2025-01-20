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
}
