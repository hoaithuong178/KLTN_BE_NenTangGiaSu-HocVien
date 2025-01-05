import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserRepository],
})
export class AppModule {}
