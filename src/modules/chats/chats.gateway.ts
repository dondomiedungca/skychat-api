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

import { Chat } from './entities/chat.entity';

interface CreateChatData {
  data: {
    conversation_id?: string;

    parties: string[];

    payload: Partial<Chat>;
  };
  conversation_id?: string;
}

@WebSocketGateway({ namespace: 'chats' })
@Injectable()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    const conversation_id = socket.handshake.query?.conversation_id;
    console.log('joining room :', conversation_id);
    socket.join(conversation_id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected');
  }

  @SubscribeMessage('sendChat')
  public async sendChat(
    @MessageBody() data: CreateChatData,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(data.conversation_id).emit('receiveChat', data.data.payload);
  }

  @SubscribeMessage('onUserKeyUp')
  public async onUserKeyUp(
    @MessageBody() data: boolean,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = socket.handshake.query?.conversation_id;
    if (room) {
      socket.to(room).emit('onUserKeyUp', data);
    }
  }

  @SubscribeMessage('onNewConversationId')
  public async onNewConversationId(
    @MessageBody() data: boolean,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = socket.handshake.query?.conversation_id;
    if (room) {
      this.server.to(room).emit('onNewConversationId', data);
    }
  }
}
