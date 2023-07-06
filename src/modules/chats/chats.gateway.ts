import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { emit } from 'process';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chats' })
@Injectable()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    const conversation_id = socket.handshake.query?.conversation_id;
    if (!!conversation_id && conversation_id != 'undefined') {
      socket.join(conversation_id);
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected');
  }

  @SubscribeMessage('sendChat')
  public async sendChat(
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(payload.conversation_id).emit('receiveChat', payload.msg);
  }

  @SubscribeMessage('onUserKeyUp')
  public async onUserKeyUp(
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = socket.handshake.query?.conversation_id;
    if (room) {
      socket.to(room).emit('onUserKeyUp', payload);
    }
  }
}
