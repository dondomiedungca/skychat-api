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
import { UsersConversations } from '../conversation/entities/users-conversations.entity';
import { User } from './entities/user.entity';

interface UpdatePartnerReels {
  fromUser: User;
  targetUser: User;
  data: UsersConversations;
}

@WebSocketGateway()
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
      console.log('individual user room :', user_id);
      socket.join(user_id);
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('individual user room disconnected');
  }

  @SubscribeMessage('user-updatePartnerReels')
  public async updatePartnerReels(
    @MessageBody() data: UpdatePartnerReels,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = `ind#__${data.targetUser.id}`;
    console.log(room);
    this.server.to(room).emit('user-updatePartnerReels', data);
  }
}
