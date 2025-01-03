import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  @Get()
  async getUser(@Query('id') id: string) {
    // Send a message to the user service and await the response
    return this.userService.send({ cmd: 'get_user' }, { id }).toPromise();
  }
}
