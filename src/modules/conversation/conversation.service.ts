import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateConversation } from './dto/create-conversation.dto';
import { FetchConversationsDto } from './dto/fetch-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchRecentDto } from './dto/fetch-recent-conversation.dto';
import { JwtPayload } from 'jsonwebtoken';
import { Chat } from '../chats/entities/chat.entity';
import { UsersConversations } from './entities/users-conversations.entity';

@Injectable()
export class ConversationService {
  constructor(
    @Inject('CONNECTION') private readonly connection: DataSource,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async create(
    createConversationDto: CreateConversation,
  ): Promise<Conversation> {
    return this.conversationRepository.save({
      ...createConversationDto,
      conversation_meta: JSON.stringify(
        createConversationDto.conversation_meta,
      ),
    });
  }

  findAll(fetchConversation: FetchConversationsDto) {
    // return this.connection
    //   .getRepository(Conversation)
    //   .createQueryBuilder('users')
    //   .where('id != :id', { id: currentUser.sub })
    //   .orderBy('created_at', 'DESC')
    //   .take(take)
    //   .skip(skip)
    //   .getMany();
  }

  async fetchRecentConversation(
    fetchRecentConversation: FetchRecentDto,
    currentUser: JwtPayload,
  ) {
    const query = await this.connection
      .createQueryBuilder(UsersConversations, 'users_conversations')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(c.id)')
          .from(Chat, 'c')
          .where('c.conversation_id = users_conversations.conversation_id')
          .andWhere('c.user_id != :id', { id: currentUser.sub })
          .andWhere('c.readed_at IS NULL');
      }, 'unread')
      .addSelect((subQuery) => {
        return subQuery
          .select('c.text')
          .from(Chat, 'c')
          .where('c.conversation_id = users_conversations.conversation_id')
          .andWhere('c.readed_at IS NULL')
          .orderBy('c.created_at', 'DESC')
          .limit(1);
      }, 'lastMessage')
      .addSelect((subQuery) => {
        return subQuery
          .select("(c.chat_meta #> '{user,_id}')::text")
          .from(Chat, 'c')
          .where('c.conversation_id = users_conversations.conversation_id')
          .andWhere('c.readed_at IS NULL')
          .orderBy('c.created_at', 'DESC')
          .limit(1);
      }, 'lastUser')
      .addSelect((subQuery) => {
        return subQuery
          .select('c.created_at')
          .from(Chat, 'c')
          .where('c.conversation_id = users_conversations.conversation_id')
          .andWhere('c.readed_at IS NULL')
          .orderBy('c.created_at', 'DESC')
          .limit(1);
      }, 'lastDateTime')
      .leftJoinAndSelect('users_conversations.conversation', 'conversation')
      .leftJoinAndSelect('users_conversations.related_to', 'related_to')
      .leftJoinAndSelect('users_conversations.user', 'user')
      .where('users_conversations.related_to = :id', { id: currentUser.sub })
      .andWhere('users_conversations.deleted_at IS NULL')
      .getRawMany();
    return query;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }

  async getConversationByParties({
    parties,
    type,
  }: {
    parties: string[];
    type?: 'personal' | 'group';
  }): Promise<Conversation> {
    const stringParties = JSON.stringify(parties).replace(/"/g, "'");

    const query = this.connection
      .createQueryBuilder(Conversation, 'conversations')
      .select()
      .where(
        `
        (conversations.conversation_meta ->> 'parties_id')::jsonb ?& ARRAY${stringParties}
      `,
      );

    if (type) {
      query.andWhere('conversations.type = :type', { type });
    }

    return query.getOne();
  }
}
