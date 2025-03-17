import { CreateMessageDto } from '@be/shared';
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
import { UserService } from '../services/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
  transports: ['websocket'],
  port: process.env.WEBSOCKET_PORT || 4001,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly usersOnline: string[] = [];

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatService: ClientProxy,
    private readonly userService: UserService
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
      this.usersOnline.push(userId);

      // send emit to me
      this.server.to(userId).emit('users_connected', this.usersOnline);

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

    const receiverId = getReceiverId(payload.conversationId, payload.senderId);

    this.chatService.emit('send_message', payload);
    this.server.to(receiverId).emit('receive_message', payload);
  }
}
