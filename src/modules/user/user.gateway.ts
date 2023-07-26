import { Injectable } from '@nestjs/common/decorators';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from '../chats/entities/chat.entity';
import { UsersConversations } from '../conversation/entities/users-conversations.entity';
import { User } from './entities/user.entity';

interface UpdatePartnerReels {
  fromUser: User;
  targetUser: User;
  data: UsersConversations;
}

interface UpdateOwnRecents {
  relatedUser: User;
  channelUserId: string;
  chat: Chat;
  conversation_id: string;
  conversation_type: string;
  users_conversations: UsersConversations;
}

@WebSocketGateway({ namespace: 'users' })
@Injectable()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    const user_id = `ind#__${socket.handshake.query?.user_id}`;
    if (
      socket.handshake.query?.user_id !== 'undefined' &&
      socket.handshake.query?.user_id !== undefined
    ) {
      socket.join(user_id);
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {}

  @SubscribeMessage('user-updatePartnerReels')
  public async updatePartnerReels(
    @MessageBody() data: UpdatePartnerReels,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = `ind#__${data.targetUser.id}`;
    this.server.to(room).emit('user-updatePartnerReels', data);
  }

  @SubscribeMessage('user-updateOwnRecents')
  public async updateOwnRecents(
    @MessageBody() data: UpdateOwnRecents,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.emit('user-updateOwnRecents', data);
  }

  @SubscribeMessage('user-updatePartnerRecents')
  public async updatePartnerRecents(
    @MessageBody() data: UpdateOwnRecents,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = `ind#__${data.channelUserId}`;
    this.server.to(room).emit('user-updatePartnerRecents', data);
  }
}
