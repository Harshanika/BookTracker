import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { User } from '../users/user.entity';
import { CreateBookDto } from './create-book.dto';
import { LendingRecord } from '../lending/lending.entity';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(LendingRecord)
        private readonly lendingRepository: Repository<LendingRecord>,
    ) {}

    async findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async findOne(id: number): Promise<Book | null> {
        return this.bookRepository.findOne({ where: { id } });
    }

    async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
        // ✅ Find the user to set as owner
        const user = await this.userRepository.findOne({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        // ✅ Create book with user as owner and default status
        const book = this.bookRepository.create({
            ...createBookDto,
            owner: user,
            status: 'available', // ✅ Default status for new books
        });

        // ✅ Save and return the book
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

    async findUserBooks(userId: number): Promise<Book[]> {
        return this.bookRepository.find({
            where: { owner: { id: userId } },
            relations: ['owner'],
            // order: { createdAt: 'DESC' },
        });
    }

    async findUserAvailableBooks(userId: number): Promise<Book[]> {
        return this.bookRepository.find({
            where: { owner: { id: userId }, status: 'available' },
            relations: ['owner'],
        });
    }

    async lendBook(bookId: number, borrowerName: string, ownerId: number, expectedReturnDate?: Date): Promise<LendingRecord> {
        // Find the book and verify ownership
        const book = await this.bookRepository.findOne({
            where: { id: bookId, owner: { id: ownerId } },
            relations: ['owner']
        });

        if (!book) {
            throw new Error('Book not found or you do not own this book');
        }

        if (book.status !== 'available') {
            throw new Error('Book is not available for lending');
        }

        // Create lending record
        const lendingRecord = this.lendingRepository.create({
            book,
            borrowerName,
            lendDate: new Date(),
            expectedReturnDate,
        });

        // Update book status to borrowed
        book.status = 'borrowed';
        await this.bookRepository.save(book);

        // Save lending record
        return this.lendingRepository.save(lendingRecord);
    }
}