import { AuthRequest, CreateTimeSlotReq } from '@be/shared';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { TimeSlotService } from '../services/timeSlot.service';

@Controller('time-slots')
export class TimeSlotController {
  private readonly logger: Logger = new Logger(TimeSlotController.name);

  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTimeSlots(
    @Request() request: AuthRequest,
    @Body() data: Array<CreateTimeSlotReq>
  ) {
    this.logger.log(
      `Received request to create time slots ${JSON.stringify(data)}`
    );

    return await this.timeSlotService.createTimeSlots(
      data.map((d) => ({ ...d, userId: request.user.id }))
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTimeSlots(@Request() request: AuthRequest) {
    this.logger.log(`Received request to get time slots`);

    return await this.timeSlotService.getTimeSlotsByUserId(request.user.id);
  }
}
