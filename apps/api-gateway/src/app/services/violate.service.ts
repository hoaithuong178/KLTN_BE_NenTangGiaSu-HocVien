import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ViolateService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  async createViolate(data: {
    userId: string;
    reason: string;
    violate: number;
  }) {
    return this.userService.send({ cmd: 'create_violate' }, data);
  }

  async getViolatesByUserId(userId: string) {
    return this.userService.send({ cmd: 'get_user_violates' }, { userId });
  }

  async getViolateById(id: string) {
    return this.userService.send({ cmd: 'get_violate' }, { id });
  }

  async updateViolate(id: string, data: { reason?: string; violate?: number }) {
    return this.userService.send({ cmd: 'update_violate' }, { id, data });
  }

  async deleteViolate(id: string) {
    return this.userService.send({ cmd: 'delete_violate' }, { id });
  }
}
