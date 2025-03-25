import { RejectPostDto } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RejectPostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: RejectPostDto) {
    return this.prismaService.postReject.create({
      data,
    });
  }
}
