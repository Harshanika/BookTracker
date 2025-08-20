import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './create-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(Number(id));
    }

    @Post()
    create(@Body() body: CreateBookDto) {
        if (!body.title || !body.author || !body.genre || !body.status) {
            throw new Error('Missing required fields: title, author, genre, status');
        }
        return this.booksService.create(body);
    }

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

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.booksService.remove(Number(id));
    }
}