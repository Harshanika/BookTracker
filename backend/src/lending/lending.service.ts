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


  async lendBook(bookId: number, userId: number, borrowerName?: string, borrowerId?: number, lendDate?: Date, expectedReturnDate?: Date) {
    const book = await this.bookRepository.findOne({ 
      where: { 
        id: bookId,
        owner: { id: userId }
      },
      relations: ['owner']
    });
    if (!book) throw new NotFoundException('Book not found or you do not own this book');

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

  async getUserLendingHistory(userId: number) {
    const lendingRecords = await this.lendingRepository.find({
      where: { 
        book: { owner: { id: userId } }
      },
      relations: ['book', 'book.owner', 'borrower'],
      order: { lendDate: 'DESC' },
    });

    // Group records by book
    const groupedByBook = lendingRecords.reduce((acc, record) => {
      const bookId = record.book.id;
      
      if (!acc[bookId]) {
        acc[bookId] = {
          book: record.book,
          lendingHistory: []
        };
      }
      
      // Determine return status based on actual vs expected return date
      let returnStatus = 'lent';
      if (record.actualReturnDate) {
        if (record.expectedReturnDate) {
          const actualDate = new Date(record.actualReturnDate);
          const expectedDate = new Date(record.expectedReturnDate);
          const diffDays = Math.ceil((actualDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 0) {
            returnStatus = diffDays === 0 ? 'returned_on_time' : 'returned_early';
          } else {
            returnStatus = 'returned_late';
          }
        } else {
          returnStatus = 'returned';
        }
      }

      acc[bookId].lendingHistory.push({
        id: record.id,
        borrowerName: record.borrowerName,
        borrower: record.borrower,
        lendDate: record.lendDate,
        expectedReturnDate: record.expectedReturnDate,
        actualReturnDate: record.actualReturnDate,
        returnNote: record.returnNote,
        status: returnStatus
      });
      
      return acc;
    }, {} as any);

    // Convert to array and sort lending history within each book
    return Object.values(groupedByBook).map((group: any) => {
      // Sort lending history chronologically (oldest first)
      const sortedHistory = group.lendingHistory.sort((a: any, b: any) => 
        new Date(a.lendDate).getTime() - new Date(b.lendDate).getTime()
      );
      
      // Get the most recent record (last element in sorted array)
      const mostRecentRecord = sortedHistory[sortedHistory.length - 1];
      
      return {
        book: group.book,
        lendingHistory: sortedHistory,
        totalLendings: sortedHistory.length,
        currentStatus: mostRecentRecord?.status || 'available'
      };
    });
  }

  async markReturned(recordId: number, userId: number, actualReturnDate?: Date, returnNote?: string) {
    const record = await this.lendingRepository.findOne({
      where: { 
        id: recordId,
        book: { owner: { id: userId } }
      },
      relations: ['book'],
    });
    if (!record) throw new NotFoundException('Lending record not found or you do not own this book');

    record.actualReturnDate = actualReturnDate || new Date();
    record.returnNote = returnNote;

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
