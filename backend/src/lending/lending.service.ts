import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LendingRecord } from './lending.entity';
import { Book } from '../books/book.entity';

@Injectable()
export class LendingService {
  constructor(
    @InjectRepository(LendingRecord)
    private lendingRepo: Repository<LendingRecord>,
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async lendBook(dto: {
    bookId: number;
    borrowerName: string;
    lendDate: Date;
    expectedReturnDate?: Date;
  }) {
    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    // mark book as borrowed
    book.status = 'borrowed';
    await this.bookRepo.save(book);

    // lendBook
    const record = this.lendingRepo.create({
      book,
      borrowerName: dto.borrowerName,
      lendDate: dto.lendDate,
      expectedReturnDate: dto.expectedReturnDate,
      actualReturnDate: undefined, // use undefined, not null
    });
    return this.lendingRepo.save(record);
  }

  async markReturned(recordId: number) {
    const record = await this.lendingRepo.findOne({
      where: { id: recordId },
      relations: ['book'],
    });
    if (!record) throw new NotFoundException('Lending record not found');

    record.actualReturnDate = new Date();

    // mark book back as available
    record.book.status = 'available';
    await this.bookRepo.save(record.book);

    return this.lendingRepo.save(record);
  }

  async getHistory(bookId: number) {
    return this.lendingRepo.find({
      where: { book: { id: bookId } },
      relations: ['book'],
      order: { lendDate: 'DESC' },
    });
  }

  // getActiveBorrowings
  async getActiveBorrowings() {
    return this.lendingRepo.find({
      where: { actualReturnDate: undefined }, // use undefined, not null
      relations: ['book'],
    });
  }
}
