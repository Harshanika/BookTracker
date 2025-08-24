import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async findOne(id: number): Promise<Book | null> {
        return this.bookRepository.findOne({ where: { id } });
    }

    async create(bookData: Partial<Book>): Promise<Book> {
        const book = this.bookRepository.create(bookData);
        return this.bookRepository.save(book);
    }

    async update(id: number, update: Partial<Book>): Promise<Book | null> {
        await this.bookRepository.update(id, update);
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.bookRepository.delete(id);
        return result.affected !== 0;
    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<[Book[], number]> {
        const [data, count] = await this.bookRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return [data, count];
    }
}