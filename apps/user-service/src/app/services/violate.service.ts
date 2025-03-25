import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { ViolateRepository } from '../repositories/violate.repository';

@Injectable()
export class ViolateService {
  private readonly logger = new Logger(ViolateService.name);

  constructor(
    private readonly violateRepository: ViolateRepository,
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService
  ) {}

  async createViolate(data: {
    userId: string;
    reason: string;
    violate: number;
  }) {
    this.logger.log(`Create violate with data: ${JSON.stringify(data)}`);

    const user = await this.userRepository.findUserById(data.userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const [violate] = await this.prismaService.$transaction(async () => [
      await this.violateRepository.create(data),
      await this.userRepository.updateViolate(
        data.userId,
        user.violate + data.violate
      ),
    ]);

    const response = {
      statusCode: 201,
      data: violate,
    };

    return response;
  }

  async getViolatesByUserId(userId: string) {
    this.logger.log(`Get violates by user id: ${userId}`);

    const violates = await this.violateRepository.findByUserId(userId);
    return {
      success: true,
      data: violates,
    };
  }

  async getViolateById(id: string) {
    this.logger.log(`Get violate by id: ${id}`);

    const violate = await this.violateRepository.findById(id);
    if (!violate) {
      throw new NotFoundException('Vi phạm không tồn tại');
    }
    return {
      success: true,
      data: violate,
    };
  }

  async updateViolate(id: string, data: { reason?: string; violate?: number }) {
    this.logger.log(
      `Update violate with id: ${id} and data: ${JSON.stringify(data)}`
    );

    return this.prismaService.$transaction(async (tx) => {
      const violate = await tx.violate.findUnique({
        where: { id },
      });
      if (!violate) {
        throw new NotFoundException('Vi phạm không tồn tại');
      }

      if (data.violate) {
        const user = await tx.user.findUnique({
          where: { id: violate.userId },
        });
        if (user) {
          await tx.user.update({
            where: { id: user.id },
            data: { violate: user.violate - violate.violate + data.violate },
          });
        }
      }

      const updatedViolate = await tx.violate.update({
        where: { id },
        data,
      });

      return {
        success: true,
        data: updatedViolate,
      };
    });
  }

  async deleteViolate(id: string) {
    this.logger.log(`Delete violate with id: ${id}`);

    return this.prismaService.$transaction(async (tx) => {
      const violate = await tx.violate.findUnique({
        where: { id },
      });
      if (!violate) {
        throw new NotFoundException('Vi phạm không tồn tại');
      }

      const user = await tx.user.findUnique({
        where: { id: violate.userId },
      });
      if (user) {
        await tx.user.update({
          where: { id: user.id },
          data: { violate: user.violate - violate.violate },
        });
      }

      await tx.violate.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Xóa vi phạm thành công',
      };
    });
  }
}
