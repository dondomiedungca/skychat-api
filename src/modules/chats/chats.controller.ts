import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Conversation } from '../conversation/entities/conversation.entity';
import { UsersConversations } from '../conversation/entities/users-conversations.entity';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { FetchChatsDto, PaginationTransformPipe } from './dto/fetch-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateUnreadDto } from './dto/update-unread.dto';
import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createChatDto: CreateChatDto,
  ): Promise<{
    targetUserJunction: UsersConversations;
    currentUserJunction: UsersConversations;
    chat: Chat;
  }> {
    return this.chatsService.create(createChatDto, currentUser);
  }

  @Get('/fetch-chats')
  findAll(
    @Query(new PaginationTransformPipe())
    fetchChatsDto: FetchChatsDto,
  ) {
    return this.chatsService.findAll(fetchChatsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Put('/update-unread')
  @UseGuards(AuthGuard)
  updateUnread(@Body() updateUnreadDto: UpdateUnreadDto) {
    return this.chatsService.updateUnread(updateUnreadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
