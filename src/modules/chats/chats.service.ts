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

  async create(
    createChatDto: CreateChatDto,
    currentUser: JwtPayload,
  ): Promise<UsersConversations> {
    const targetUserId = createChatDto.parties.find(
      (el) => el !== currentUser.sub,
    );

    let conversation: Conversation;
    let targetUserJunction: UsersConversations;
    const currentUserObject = await this.userRepository.findById(
      currentUser.sub,
    );
    const targetUser = await this.userRepository.findById(targetUserId);

    if (createChatDto.conversation_id) {
      conversation = await this.connection
        .createQueryBuilder(Conversation, 'conversation')
        .where('conversation.id = :id', { id: createChatDto.conversation_id })
        .getOne();

      targetUserJunction = await this.connection
        .createQueryBuilder(UsersConversations, 'user_conversations')
        .select('user_conversations.*')
        .leftJoinAndSelect('user_conversations.conversation', 'conversation')
        .where(
          'user_id = :targetUserId AND conversation_id = :conversation_id',
          { targetUserId, conversation_id: conversation?.id },
        )
        .getOne();

      await this.chatRepository.save({
        user: currentUserObject,
        text: createChatDto.payload.text,
        conversation,
        chat_meta: JSON.stringify(createChatDto.payload.chat_meta),
        created_at: moment(createChatDto.payload.created_at).utc().toDate(),
      });
    } else {
      conversation = await this.conversationService.getConversationByParties({
        parties: createChatDto.parties,
        type: 'personal',
      });

      targetUserJunction = await this.connection
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
        targetUserJunction.display_name = `${targetUser.firstName} ${targetUser.lastName}`;
        targetUserJunction.user = targetUser;
        targetUserJunction.related_to = currentUserObject;
        targetUserJunction.conversation = conversation;

        currentUserJunction = new UsersConversations();
        currentUserJunction.display_name = `${currentUserObject.firstName} ${currentUserObject.lastName}`;
        currentUserJunction.user = currentUserObject;
        currentUserJunction.related_to = targetUser;
        currentUserJunction.conversation = conversation;

        await this.connection.manager.save(targetUserJunction);
        await this.connection.manager.save(currentUserJunction);
      }

      await this.chatRepository.save({
        user: currentUserObject,
        text: createChatDto.payload.text,
        conversation,
        chat_meta: JSON.stringify(createChatDto.payload.chat_meta),
        created_at: moment(createChatDto.payload.created_at).utc().toDate(),
      });
    }

    return targetUserJunction;
  }

  async findAll(fetchChatsDto: FetchChatsDto) {
    const take = 15;
    const skip = fetchChatsDto.currentLength;
    let allchat = fetchChatsDto.allChat || 0;
    let chats: Chat[];

    if (!fetchChatsDto?.conversation_id) {
      const attemptConversation =
        await this.conversationService.getConversationByParties({
          parties: fetchChatsDto.parties,
        });

      if (!allchat) {
        if (!!attemptConversation) {
          allchat = await this.connection
            .createQueryBuilder(Chat, 'chats')
            .where('chats.conversation_id = :conversation_id', {
              conversation_id: attemptConversation.id,
            })
            .getCount();
        }
      }

      if (!!attemptConversation) {
        chats = await this.connection
          .createQueryBuilder(Chat, 'chats')
          .where('chats.conversation_id = :conversation_id', {
            conversation_id: attemptConversation.id,
          })
          .orderBy('chats.created_at', 'DESC')
          .take(take)
          .skip(skip)
          .getMany();
      }
    }
    if (!allchat) {
      allchat = await this.connection
        .createQueryBuilder(Chat, 'chats')
        .where('chats.conversation_id = :conversation_id', {
          conversation_id: fetchChatsDto.conversation_id,
        })
        .getCount();
    }
    chats = await this.connection
      .createQueryBuilder(Chat, 'chats')
      .where('chats.conversation_id = :conversation_id', {
        conversation_id: fetchChatsDto.conversation_id,
      })
      .orderBy('chats.created_at', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();

    return {
      chats,
      allchat,
    };
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
