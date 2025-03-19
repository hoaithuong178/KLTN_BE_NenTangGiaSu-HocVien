import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import BlockchainModule from './blockchain';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PaymentModule, BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
