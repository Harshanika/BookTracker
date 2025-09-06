import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LendingRecord } from './lending.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LendingService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LendingRecord)
    private readonly lendingRepository: Repository<LendingRecord>,
) {}


  async lendBook(bookId: number, borrowerName?: string, borrowerId?: number, lendDate?: Date, expectedReturnDate?: Date) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    // mark book as borrowed
    book.status = 'borrowed';
    await this.bookRepository.save(book);

    // Find borrower if borrowerId is provided
    let borrower: User | undefined = undefined;
    if (borrowerId) {
      const foundBorrower = await this.userRepository.findOne({ where: { id: borrowerId } });
      if (foundBorrower) {
        borrower = foundBorrower;
      }
    }

    // lendBook
    const record = this.lendingRepository.create({
      book,
      borrower: borrower || undefined,
      borrowerName: borrowerName,
      lendDate: lendDate || new Date(),
      expectedReturnDate: expectedReturnDate,
      actualReturnDate: undefined, // use undefined, not null
    });
    return this.lendingRepository.save(record);
  }


  async getHistory(bookId: number) {
    return this.lendingRepository.find({
      where: { book: { id: bookId } },
      relations: ['book'],
      order: { lendDate: 'DESC' },
    });
  }

  // getActiveBorrowings
  async getActiveBorrowings() {
    return this.lendingRepository.find({
      where: { actualReturnDate: undefined }, // use undefined, not null
      relations: ['book'],
    });
  }

  async getUserLendingHistory() {
    return this.lendingRepository.find({
      relations: ['book', 'book.owner'],
      order: { lendDate: 'DESC' },
    });
  }

  async markReturned(recordId: number) {
    const record = await this.lendingRepository.findOne({
      where: { 
        id: recordId,
      },
      relations: ['book'],
    });
    if (!record) throw new NotFoundException('Lending record not found or you do not own this book');

    record.actualReturnDate = new Date();

    // mark book back as available
    record.book.status = 'available';
    await this.bookRepository.save(record.book);

    return this.lendingRepository.save(record);
  }

  async getUserActiveBorrowings() {
    return this.lendingRepository.find({
      where: { 
        actualReturnDate: undefined,
      },
      relations: ['book', 'book.owner'],
      order: { lendDate: 'DESC' },
    });
  }
}
