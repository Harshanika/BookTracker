import { Injectable } from '@nestjs/common';
import { Book } from '../books/book.entity'; // Adjust the path as needed
import { User } from '../users/user.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}
  getStats() {
    return {
      totalBooks: 10,
      borrowedBooks: 3,
      overdueBooks: 1,
    };
  }

  getBorrowedBooksByUser(userId: number) {
    userId = 1;
    return this.bookRepository.find({ where: { owner: { id: userId } } });
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

  getOverdueBooksByUser(userId: number) {
    userId = 1;
    return this.bookRepository.find({ where: { owner: { id: userId } } });
  }
}
