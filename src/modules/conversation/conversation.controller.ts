import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { FetchConversationsDto } from './dto/fetch-conversation.dto';
import { FetchRecentDto } from './dto/fetch-recent-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // @Post()
  // create(@Body() createConversationDto: CreateConversationDto) {
  //   return this.conversationService.create(createConversationDto);
  // }

  @Get('/fetch-conversations')
  findAll(@Body() fetchConversation: FetchConversationsDto) {
    return this.conversationService.findAll(fetchConversation);
  }

  @Get('/fetch-recent-conversations')
  fetchRecent(
    @CurrentUser() currentUser: JwtPayload,
    @Query('page') page: number,
    @Query('search') search?: string,
  ) {
    return this.conversationService.fetchRecentConversation(
      { page, search },
      currentUser,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
