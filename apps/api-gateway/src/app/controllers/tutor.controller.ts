import { AuthRequest, CreateTutorReq, SearchTutor } from '@be/shared';
import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
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

  @Patch()
  @UseGuards(AuthGuard)
  async updateTutor(
    @Request() request: AuthRequest,
    @Body() data: Partial<CreateTutorReq>
  ) {
    this.logger.log(
      `Received request to update tutor with data: ${JSON.stringify(data)}`
    );

    return await this.tutorService.updateTutor(request.user.id, data);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTutor(@Request() request: AuthRequest) {
    this.logger.log(`Received request to get tutor`);

    return await this.tutorService.getTutorById(request.user.id);
  }

  @Get('search')
  async searchTutor(@Query() data: SearchTutor) {
    this.logger.log(
      `Received request to search tutor with data: ${JSON.stringify(data)}`
    );

    return await this.tutorService.searchTutor(data);
  }

  @Get('specializations/count')
  async countTutorsBySpecializations() {
    this.logger.log('Received request to count tutors by specializations');

    return await this.tutorService.countTutorsBySpecializations();
  }
}
