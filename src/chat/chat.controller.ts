import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateChatDto, @Request() req) {
    return this.chatService.create(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  searchChats(
    @Request() req,
    @Query() queries: { query: string; type: string },
  ) {
    if (req.user.id) {
      return this.chatService.searchChats(req.user.id, queries);
    }
    return this.chatService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  findChatsByUserId(@Request() req, @Query('game') game?: string) {
    if (game) {
      return this.chatService.findGamesByUserId(req.user.id);
    }
    return this.chatService.findChatsByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatDto: { image_url: string },
  ) {
    return this.chatService.update(+id, updateChatDto.image_url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
