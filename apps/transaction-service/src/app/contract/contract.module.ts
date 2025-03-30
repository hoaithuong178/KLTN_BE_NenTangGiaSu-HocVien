import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractController } from './contract.controller';
import { ContractRepository } from './contract.repository';
import { ContractService } from './contract.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContractController],
  providers: [ContractService, ContractRepository],
})
export class ContractModule {}
