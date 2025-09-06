import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './create-book.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthenticatedRequest } from '../dashboard/interfaces/authenticated.request';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
  ) {
      const [data, total] = await this.booksService.findAllPaginated(page, limit);
      return { data, total, page, limit };
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async create(@Body() createBookDto: CreateBookDto, @Req() req: AuthenticatedRequest) {
    if (!createBookDto.title || !createBookDto.author || !createBookDto.genre || !createBookDto.status) {
      throw new Error('Missing required fields: title, author, genre, status');
    }
    return this.booksService.create(createBookDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { title?: string; author?: string; genre?: string; status?: 'available' | 'borrowed' },
  ) {
    if (!body.title && !body.author && !body.genre && !body.status) {
      throw new Error('At least one field must be provided for update');
    }
    return this.booksService.update(Number(id), body);
  }

  @UseGuards(AuthGuard)
  @Get('my-books')
  async getMyBooks(@Req() req: AuthenticatedRequest) {
    return this.booksService.findUserBooks(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('my-available-books')
  async getMyAvailableBooks(@Req() req: AuthenticatedRequest) {
    return this.booksService.findUserAvailableBooks(req.user.sub);
  }
}