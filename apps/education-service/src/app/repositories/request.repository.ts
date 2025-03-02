import { RequestStatus } from '.prisma/education-service';
import { CreateRequest, UpdateRequest, UserBase } from '@be/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ feePerSession, ...data }: CreateRequest) {
    return this.prismaService.request.create({
      data: {
        ...data,
        schedule: data.schedule.map((s) => ({
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        })),
        from: {
          set: data.from,
        },
        to: {
          set: data.to,
        },
        feePerSessions: {
          set: {
            adjustmentTime: new Date(),
            price: feePerSession,
          },
        },
      },
    });
  }

  findAll() {
    return this.prismaService.request.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prismaService.request.findUnique({
      where: { id },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return this.prismaService.request.findFirst({
      where: {
        id,
        OR: [
          {
            from: {
              is: {
                id: userId,
              },
            },
          },
          {
            to: {
              is: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  }

  findByFromUserId(userId: string) {
    return this.prismaService.request.findMany({
      where: {
        from: {
          is: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findByToUserId(userId: string) {
    return this.prismaService.request.findMany({
      where: {
        to: {
          is: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findByUserId(userId: string) {
    return this.prismaService.request.findMany({
      where: {
        OR: [
          {
            to: {
              is: {
                id: userId,
              },
            },
          },
          {
            from: {
              is: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  }

  update(
    id: string,
    { feePerSession, schedule, from, to, ...data }: Partial<UpdateRequest>
  ) {
    return this.prismaService.request.update({
      where: {
        id,
        from: {
          is: {
            id: from.id,
          },
        },
      },
      data: {
        ...data,
        ...(schedule && {
          schedule: schedule.map((s) => ({
            startTime: new Date(s.startTime),
            endTime: new Date(s.endTime),
          })),
        }),
        ...(to && {
          to: {
            set: to,
          },
        }),
        ...(feePerSession && {
          feePerSessions: {
            push: {
              adjustmentTime: new Date(),
              price: feePerSession,
            },
          },
        }),
      },
    });
  }

  updateStatus(id: string, status: RequestStatus, feePerSession?: number) {
    return this.prismaService.request.update({
      where: { id },
      data: {
        status,
        ...(feePerSession && {
          feePerSessions: {
            push: {
              price: feePerSession,
              adjustmentTime: new Date(),
            },
          },
        }),
      },
    });
  }

  delete(id: string) {
    return this.prismaService.request.delete({
      where: { id },
    });
  }

  deleteByFromUserId(id: string, userId: string) {
    return this.prismaService.request.delete({
      where: {
        id,
        from: {
          is: {
            id: userId,
          },
        },
      },
    });
  }

  updateToUser({ id, avatar, name }: UserBase) {
    return this.prismaService.request.updateMany({
      where: {
        to: {
          is: {
            id,
          },
        },
      },
      data: {
        to: {
          update: {
            ...(name && { name }),
            ...(avatar && { avatar }),
          },
        },
      },
    });
  }

  updateFromUser({ id, avatar, name }: UserBase) {
    return this.prismaService.request.updateMany({
      where: {
        from: {
          is: {
            id,
          },
        },
      },
      data: {
        from: {
          update: {
            ...(name && { name }),
            ...(avatar && { avatar }),
          },
        },
      },
    });
  }
}
