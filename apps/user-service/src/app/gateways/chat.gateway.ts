import { CreateMessageDto, REDIS_KEY } from '@be/shared';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getReceiverId } from '../../utils';
import Redis from '../configs/redis.config';
import { BenefitUserService } from '../services/benefitUser.service';
import { UserService } from '../services/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/socket.io',
  port: process.env.PORT || 4001,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly usersOnline: Set<string> = new Set<string>();

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatService: ClientProxy,
    private readonly userService: UserService,
    private readonly benefitUserService: BenefitUserService
  ) {}

  afterInit() {
    this.logger.log(
      `WebSocket Gateway đang chạy trên port ${
        process.env.WEBSOCKET_PORT || 4001
      }`
    );
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    this.logger.log(`User connected: ${userId}`);

    if (userId) {
      client.join(userId);
      this.usersOnline.add(userId);

      // send emit to me
      this.server
        .to(userId)
        .emit('users_connected', Array.from(this.usersOnline));

      client.broadcast.emit('user_connected', userId);

      try {
        await this.userService.updateOnlineStatus(userId, true);
      } catch (error) {
        this.logger.error(`Error updating user status for ${userId}: ${error}`);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;

    this.logger.log(`User disconnected: ${userId}`);

    this.usersOnline.delete(userId);

    if (userId) {
      client.leave(userId);
      client.broadcast.emit('user_disconnected', userId);

      try {
        await this.userService.updateOnlineStatus(userId, false);
      } catch (error) {
        this.logger.error(`Error updating user status for ${userId}: ${error}`);
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    this.logger.log(`Received message: ${JSON.stringify(payload)}`);

    const USER_BENEFIT_KEY = REDIS_KEY.userBenefit(payload.senderId);

    const [userBenefit, user] = await Promise.all([
      this.benefitUserService.getUserBenefit(payload.senderId),
      this.userService.getUserById(payload.senderId),
    ]);

    const receiverId = getReceiverId(payload.conversationId, payload.senderId);

    if (
      (!userBenefit && user.data.role === 'STUDENT') ||
      (typeof userBenefit === 'object' &&
        userBenefit.remaining <= 0 &&
        !userBenefit.connectedUserIds.includes(receiverId))
    ) {
      this.server
        .to(payload.senderId)
        .emit('user_benefit_exceeded', receiverId);
      return;
    }

    this.chatService.emit('send_message', payload);
    this.server.to(receiverId).emit('receive_message', payload);

    if (
      user.data.role === 'STUDENT' &&
      !userBenefit.connectedUserIds.includes(receiverId)
    ) {
      this.chatService.emit('connect_user', {
        fromUserId: payload.senderId,
        toUserId: receiverId,
      });

      Redis.getInstance()
        .getClient()
        .set(
          USER_BENEFIT_KEY,
          JSON.stringify(
            typeof userBenefit === 'object'
              ? {
                  ...userBenefit,
                  remaining: userBenefit.remaining - 1,
                  connectedUserIds: [
                    ...userBenefit.connectedUserIds,
                    receiverId,
                  ],
                }
              : {}
          )
        )
        .then(() => {
          this.logger.log(
            `User benefit for ${payload.senderId} updated to Redis`
          );
        })
        .catch((error) => {
          this.logger.error(
            `Error updating user benefit for ${payload.senderId}: ${error}`
          );
        });
    }
  }
}
