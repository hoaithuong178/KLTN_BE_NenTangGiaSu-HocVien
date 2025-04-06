import { CreateBenefitDto, UpdateBenefitDto } from '@be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BenefitService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy
  ) {}

  createBenefit(data: CreateBenefitDto) {
    return lastValueFrom(
      this.userService.send({ cmd: 'create_benefit' }, data)
    );
  }

  findAllBenefits() {
    return lastValueFrom(
      this.userService.send({ cmd: 'find_all_benefits' }, {})
    );
  }

  findBenefitById(id: string) {
    return lastValueFrom(
      this.userService.send({ cmd: 'find_benefit_by_id' }, { id })
    );
  }

  updateBenefit(id: string, data: UpdateBenefitDto) {
    return lastValueFrom(
      this.userService.send({ cmd: 'update_benefit' }, { id, data })
    );
  }

  deleteBenefit(id: string) {
    return lastValueFrom(
      this.userService.send({ cmd: 'delete_benefit' }, { id })
    );
  }
}
