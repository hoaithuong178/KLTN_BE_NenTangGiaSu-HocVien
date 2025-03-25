import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ViolateService } from '../services/violate.service';

@Controller('violates')
export class ViolateController {
  constructor(private readonly violateService: ViolateService) {}

  @MessagePattern({ cmd: 'create_violate' })
  createViolate(data: { userId: string; reason: string; violate: number }) {
    return this.violateService.createViolate(data);
  }

  @MessagePattern({ cmd: 'get_user_violates' })
  getViolatesByUserId(data: { userId: string }) {
    return this.violateService.getViolatesByUserId(data.userId);
  }

  @MessagePattern({ cmd: 'get_violate' })
  getViolateById(data: { id: string }) {
    return this.violateService.getViolateById(data.id);
  }

  @MessagePattern({ cmd: 'update_violate' })
  updateViolate(data: {
    id: string;
    data: { reason?: string; violate?: number };
  }) {
    return this.violateService.updateViolate(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete_violate' })
  deleteViolate(data: { id: string }) {
    return this.violateService.deleteViolate(data.id);
  }
}
