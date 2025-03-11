import { RequestStatus } from '.prisma/education-service';
import { Role } from '.prisma/user-service';
import {
  AuthRequest,
  CreateRequestRequest,
  UpdateRequestRequest,
} from '@be/shared';
import {
  Body,
  Controller,
  Delete,
  Request as ExpressRequest,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { RequestService } from '../services/request.service';
import { SubjectService } from '../services/subject.service';
import { UserService } from '../services/user.service';

@Controller('requests')
export class RequestController {
  private readonly logger: Logger = new Logger(RequestController.name);

  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService,
    private readonly subjectService: SubjectService
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async create(
    @Body() { toId, subjectId, ...data }: CreateRequestRequest,
    @Request() req: AuthRequest
  ) {
    this.logger.log(`Create request with data: ${JSON.stringify(data)}`);

    const [user, to, subject] = await Promise.all([
      this.userService.getUserById(req.user.id),
      this.userService.getUserById(toId),
      this.subjectService.findById(subjectId),
    ]);

    if (!user) {
      throw new RpcException('User not found');
    }

    if (!to) {
      throw new RpcException('User not found');
    }

    if (!subject) {
      throw new RpcException('Subject not found');
    }

    if (user.data.role === Role.TUTOR && data.type === 'TEACH_REQUEST') {
      throw new RpcException('Only student can create teach request');
    }

    return this.requestService.create({
      ...data,
      from: {
        id: user.data.id,
        avatar: user.data.avatar || '',
        name: user.data.name,
      },
      to: {
        id: to.data.id,
        avatar: to.data.avatar || '',
        name: to.data.name,
      },
      subject: {
        id: subjectId,
        name: subject.data.name,
      },
    });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async findAll() {
    this.logger.log('Get all requests');
    return this.requestService.findAll();
  }

  @Get('from-me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async findByFromUserId(@ExpressRequest() req: AuthRequest) {
    this.logger.log(`Get requests from user: ${req.user.id}`);
    return this.requestService.findByFromUserId(req.user.id);
  }

  @Get('to-me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async findByToUserId(@ExpressRequest() req: AuthRequest) {
    this.logger.log(`Get requests to user: ${req.user.id}`);
    return this.requestService.findByToUserId(req.user.id);
  }

  @Get('user')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async findByUserId(@ExpressRequest() req: AuthRequest) {
    this.logger.log(`Get requests by user: ${req.user.id}`);
    return this.requestService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async findById(@Param('id') id: string, @ExpressRequest() req: AuthRequest) {
    this.logger.log(`Get request by id: ${id}`);
    return this.requestService.findById({
      id,
      userId: req.user.id,
      role: req.user.role as Role,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() data: { status: RequestStatus; feePerSession?: number }
  ) {
    this.logger.log(
      `Update request status ${id} with data: ${JSON.stringify(data)}`
    );

    return this.requestService.updateStatus({
      id,
      userId: req.user.id,
      status: data.status,
      feePerSession: data.feePerSession,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async update(
    @Param('id') id: string,
    @Body() { toId, subjectId, ...data }: Partial<UpdateRequestRequest>,
    @ExpressRequest() req: AuthRequest
  ) {
    this.logger.log(`Update request ${id} with data: ${JSON.stringify(data)}`);

    const from = await this.userService.getUserById(req.user.id);

    if (!from) {
      throw new RpcException('User not found');
    }

    const to = toId ? await this.userService.getUserById(toId) : null;

    if (toId && !to) {
      throw new RpcException('User not found');
    }

    const subject = subjectId
      ? await this.subjectService.findById(subjectId)
      : null;

    if (subjectId && !subject) {
      throw new RpcException('Subject not found');
    }

    return this.requestService.update(id, {
      ...data,
      from: {
        id: from.data.id,
        avatar: from.data.avatar || '',
        name: from.data.name,
      },
      ...(toId && {
        to: {
          id: to.data.id,
          avatar: to.data.avatar || '',
          name: to.data.name,
        },
      }),
      ...(subjectId && {
        subject: {
          id: subjectId,
          name: subject.data.name,
        },
      }),
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.STUDENT, Role.TUTOR])
  async delete(@Param('id') id: string, @Request() req: AuthRequest) {
    this.logger.log(`Delete request ${id}`);
    return this.requestService.delete({
      id,
      userId: req.user.id,
      role: req.user.role as Role,
    });
  }
}
