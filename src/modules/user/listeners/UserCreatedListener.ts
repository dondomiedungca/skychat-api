import { MailService } from './../../mail/mail.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../entities/user.entity';

interface UserCreatedType {
  user: User;
  hash: string;
}

@Injectable()
export class UserCreatedListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.created', { async: true })
  async handleOrderCreatedEvent(payload: UserCreatedType) {
    await this.mailService.sendUserConfirmation(payload.user, payload.hash);
  }
}
