import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface UserCreatedType {
  email: string;
  hash: string;
}

@Injectable()
export class UserCreatedListener {
  @OnEvent('command.user.created')
  handleOrderCreatedEvent(payload: UserCreatedType) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
