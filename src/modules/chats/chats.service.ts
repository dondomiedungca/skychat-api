import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { JwtPayload } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/modules/user/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { FetchChatsDto } from './dto/fetch-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ConversationService } from '../conversation/conversation.service';
import { Chat, ConversationMeta } from './entities/chat.entity';
import { UsersConversations } from '../conversation/entities/users-conversations.entity';
import { Conversation } from '../conversation/entities/conversation.entity';

@Injectable()
export class ChatsService {
  constructor(
    @Inject('CONNECTION') private readonly connection: DataSource,
    private readonly conversationService: ConversationService,
    private readonly userRepository: UserRepository,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto, currentUser: JwtPayload) {
    const targetUserId = createChatDto.parties.find(
      (el) => el !== currentUser.sub,
    );

    let chat: Chat;

    if (createChatDto.conversation_id) {
    } else {
      const currentUserObject = await this.userRepository.findById(
        currentUser.sub,
      );
      const targetUser = await this.userRepository.findById(targetUserId);

      let conversation: Conversation =
        await this.conversationService.getConverrationByParties({
          parties: createChatDto.parties,
          type: 'personal',
        });

      let targetUserJunction: UsersConversations = await this.connection
        .createQueryBuilder(UsersConversations, 'user_conversations')
        .select('user_conversations.*')
        .where(
          'user_id = :targetUserId AND conversation_id = :conversation_id',
          { targetUserId, conversation_id: conversation?.id },
        )
        .getOne();
      let currentUserJunction: UsersConversations = await this.connection
        .createQueryBuilder(UsersConversations, 'user_conversations')
        .select('user_conversations.*')
        .where(
          'user_id = :currentUserId AND conversation_id = :conversation_id',
          { currentUserId: currentUser.sub, conversation_id: conversation?.id },
        )
        .getOne();

      if (!targetUserJunction && !currentUserJunction && !conversation) {
        const conversation_meta: ConversationMeta = {
          type: 'personal',
          parties_id: createChatDto.parties,
          parties_name: [
            `${currentUserObject.firstName} ${currentUserObject.lastName}`,
            `${targetUser.firstName} ${targetUser.lastName}`,
          ],
        };

        conversation = await this.conversationService.create({
          conversation_meta,
          type: 'personal',
          created_at: moment.utc().toDate(),
          updated_at: moment.utc().toDate(),
        });

        targetUserJunction = new UsersConversations();
        targetUserJunction.display_name = `${currentUserObject.firstName} ${currentUserObject.lastName}`;
        targetUserJunction.user = targetUser;
        targetUserJunction.conversation = conversation;

        currentUserJunction = new UsersConversations();
        currentUserJunction.display_name = `${targetUser.firstName} ${targetUser.lastName}`;
        currentUserJunction.user = currentUserObject;
        currentUserJunction.conversation = conversation;

        await this.connection.manager.save(targetUserJunction);
        await this.connection.manager.save(currentUserJunction);
      }

      chat = await this.chatRepository.save({
        user: currentUserObject,
        text: createChatDto.msg.text,
        conversation,
        chat_meta: JSON.stringify(createChatDto.msg),
      });
    }

    return 'This action adds a new chat';
  }

  async findAll(fetchChatsDto: FetchChatsDto) {
    const take = 100;
    const skip = ((fetchChatsDto?.page || 0) - 1) * take;

    if (!fetchChatsDto?.conversation_id) {
      const attemptConversation =
        await this.conversationService.getConverrationByParties({
          parties: fetchChatsDto.parties,
        });

      if (!!attemptConversation) {
        return this.connection
          .createQueryBuilder(Chat, 'chats')
          .where('chats.conversation_id = :conversation_id', {
            conversation_id: attemptConversation.id,
          })
          .orderBy('id', 'DESC')
          .take(take)
          .skip(skip)
          .getMany();
      }
    }
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
