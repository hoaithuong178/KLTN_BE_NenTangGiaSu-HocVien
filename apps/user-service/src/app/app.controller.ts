import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'get_user' }) // Handle specific message
  getUser(data: { id: string }) {
    console.log('Received message:', data);

    return { id: data.id, name: 'John Doe', email: 'john.doe@example.com' };
  }
}
