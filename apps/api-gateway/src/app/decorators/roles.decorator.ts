import { Role } from '.prisma/user-service';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<Role[]>();
