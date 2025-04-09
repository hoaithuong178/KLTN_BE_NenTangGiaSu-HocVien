import { CreateUserProfile, UpdateUserProfile } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUserProfile({
    id,
    dob,
    ...data
  }: CreateUserProfile & {
    avatar?: string;
  }) {
    return this.prismaService.userProfile.create({
      data: {
        ...data,
        dob: new Date(dob),
        user: {
          connect: {
            id,
          },
        },
      },
    });
  }

  getUserProfileById(id: string) {
    return this.prismaService.userProfile.findUnique({
      where: {
        id,
      },
    });
  }

  updateUserProfile(
    id: string,
    {
      dob,
      avatar,
      ...data
    }: Partial<Omit<UpdateUserProfile, 'id'>> & {
      avatar?: string;
    }
  ) {
    return this.prismaService.userProfile.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(dob && { dob: new Date(dob) }),
        ...(avatar && { avatar }),
      },
    });
  }

  deleteUserProfile(id: string) {
    return this.prismaService.userProfile.delete({
      where: {
        id,
      },
    });
  }

  updateWalletAddress(id: string, walletAddress: string) {
    return this.prismaService.userProfile.update({
      where: { id },
      data: { walletAddress },
    });
  }

  getWalletAddress(id: string) {
    return this.prismaService.userProfile.findUnique({
      where: { id },
      select: { walletAddress: true },
    });
  }
}
