import { CreateBenefitDto, UpdateBenefitDto } from '@be/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BenefitService } from '../services/benefit.service';

@Controller('benefits')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @MessagePattern({ cmd: 'create_benefit' })
  createBenefit(data: CreateBenefitDto) {
    return this.benefitService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_benefits' })
  findAllBenefits() {
    return this.benefitService.findAll();
  }

  @MessagePattern({ cmd: 'find_benefit_by_id' })
  findBenefitById(data: { id: string }) {
    return this.benefitService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'update_benefit' })
  updateBenefit(data: { id: string; data: UpdateBenefitDto }) {
    return this.benefitService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete_benefit' })
  deleteBenefit(data: { id: string }) {
    return this.benefitService.delete(data.id);
  }
}
