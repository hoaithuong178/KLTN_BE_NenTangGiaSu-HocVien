import { Controller, Get, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger: Logger = new Logger(HealthController.name);

  @Get()
  health() {
    this.logger.log('Health check');

    return 'Transaction service is up and running';
  }
}
