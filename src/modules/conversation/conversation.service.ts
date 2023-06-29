import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateConversation } from './dto/create-conversation.dto';
import { FetchConversationsDto } from './dto/fetch-conversation';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }

  async getConverrationByParties({
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
