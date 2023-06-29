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
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { FetchChatsDto, PaginationTransformPipe } from './dto/fetch-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createChatDto: CreateChatDto,
  ) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
