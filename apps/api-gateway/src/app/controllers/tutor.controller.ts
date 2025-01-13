import { AuthRequest, CreateTutorReq } from '@be/shared';
import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { TutorService } from '../services/tutor.service';

@Controller('tutors')
export class TutorController {
  private readonly logger: Logger = new Logger(TutorController.name);

  constructor(private readonly tutorService: TutorService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTutor(
    @Request() request: AuthRequest,
    @Body() data: CreateTutorReq
  ) {
    this.logger.log(`Received request to create tutor ${JSON.stringify(data)}`);

    return await this.tutorService.createTutor({
      ...data,
      id: request.user.id,
    });
  }
}
