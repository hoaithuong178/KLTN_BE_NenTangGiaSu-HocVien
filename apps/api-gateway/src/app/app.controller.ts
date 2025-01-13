import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  @Get()
  async test() {
    return 'Hello from API Gateway';
  }

  @Get('rabbit-mq')
  async testRabbitMQ() {
    return this.userService.send({ cmd: 'rabbit-mq' }, {});
  }
}
