import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'rabbit-mq' }) // Handle specific message
  testRabbitMQ() {
    return 'Hello from RabbitMQ';
  }
}
