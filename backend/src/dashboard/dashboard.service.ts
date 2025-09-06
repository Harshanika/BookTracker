import { Injectable } from '@nestjs/common';
import { Book } from '../books/book.entity'; // Adjust the path as needed
import { User } from '../users/user.entity';
import { LendingRecord } from '../lending/lending.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(LendingRecord)
        private readonly lendingRepository: Repository<LendingRecord>,
    ) {}
  async getStats(userId: number) {
    // Get total books owned by user
    const totalBooks = await this.bookRepository.count({
      where: { owner: { id: userId } }
    });

    // Get borrowed books (books lent out by user) - count from lending records
    const borrowedBooks = await this.lendingRepository
      .createQueryBuilder('lending')
      .leftJoin('lending.book', 'book')
      .where('book.owner.id = :userId', { userId })
      .andWhere('lending.actualReturnDate IS NULL')
      .getCount();

    // Get overdue books (books with expected return date passed and not returned)
    const currentDate = new Date();
    const overdueBooks = await this.lendingRepository
      .createQueryBuilder('lending')
      .leftJoin('lending.book', 'book')
      .where('book.owner.id = :userId', { userId })
      .andWhere('lending.expectedReturnDate < :currentDate', { currentDate })
      .andWhere('lending.actualReturnDate IS NULL')
      .getCount();

    return {
      totalBooks,
      borrowedBooks,
      overdueBooks,
    };
  }

  async getBorrowedBooksByUser(userId: number, page = 1, limit = 10) {
    // Use query builder to join with lending records for borrower information
    const queryBuilder = this.lendingRepository
      .createQueryBuilder('lending')
      .leftJoinAndSelect('lending.book', 'book')
      .leftJoinAndSelect('book.owner', 'owner')
      .leftJoinAndSelect('lending.borrower', 'borrower')
      .where('book.owner.id = :userId', { userId })
      .andWhere('lending.actualReturnDate IS NULL');

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const lendingRecords = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Transform the data to include borrower information
    const books = lendingRecords.map(record => ({
      id: record.book.id,
      lendingId: record.id, // Include lending record ID for return functionality
      title: record.book.title,
      author: record.book.author,
      genre: record.book.genre,
      status: 'borrowed', // Always show as borrowed since it's in lending records
      owner: record.book.owner,
      // Borrower information
      borrowerName: record.borrowerName,
      borrower: record.borrower,
      lendDate: record.lendDate,
      expectedReturnDate: record.expectedReturnDate,
      actualReturnDate: record.actualReturnDate,
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      books,
    };
  }
  async getOwnedBooksByUser(userId: number, page = 1, limit = 10) {
    const [books, total] = await this.bookRepository.findAndCount({
        where: { owner: { id: userId } },
        relations: ['owner'],
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        books,
    };
  }

  async getOverdueBooksByUser(userId: number, page = 1, limit = 10) {
    const currentDate = new Date();
    const queryBuilder = this.lendingRepository
      .createQueryBuilder('lending')
      .leftJoinAndSelect('lending.book', 'book')
      .leftJoinAndSelect('book.owner', 'owner')
      .where('book.owner.id = :userId', { userId })
      .andWhere('lending.expectedReturnDate < :currentDate', { currentDate })
      .andWhere('lending.actualReturnDate IS NULL');

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const lendingRecords = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      lendingRecords,
    };
  }
}
