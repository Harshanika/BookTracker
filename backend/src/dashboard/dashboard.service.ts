import { Injectable } from '@nestjs/common';
import { Book } from '../books/book.entity'; // Adjust the path as needed
import { User } from '../users/user.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class DashboardService {

    private mockUser: User = {
        id: 1,
        fullname: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
        books: [], // Add this line
    };
    private books: Book[] = [
        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            status: 'available',
            owner: this.mockUser,
            lendingRecords: [],// Example owner ID
        },
        {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            genre: 'Classic',
            status: 'borrowed',
            owner: this.mockUser, // Example owner ID
            lendingRecords: [],
        },
        { id: 3, title: '1984',
            author: 'George Orwell',
            genre: 'Dystopian',
            status: 'available',
            owner: this.mockUser, // Example owner ID
            lendingRecords: [],
        },
        {
            id: 4,
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            genre: 'Romance',
            status: 'available',
            owner: this.mockUser, // Example owner ID
            lendingRecords: [],
        },
        {
            id: 5,
            title: 'Moby-Dick',
            author: 'Herman Melville',
            genre: 'Adventure',
            status: 'borrowed',
            owner: this.mockUser, // Example owner ID
            lendingRecords: [],
        },
        // {
        //     id: 6,
        //     title: 'War and Peace',
        //     author: 'Leo Tolstoy',
        //     genre: 'Historical',
        //     status: 'available',
        // },
        // {
        //     id: 7,
        //     title: 'The Catcher in the Rye',
        //     author: 'J.D. Salinger',
        //     genre: 'Classic',
        //     status: 'available',
        // },
        // { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'available' },
        // {
        //     id: 9,
        //     title: 'Brave New World',
        //     author: 'Aldous Huxley',
        //     genre: 'Dystopian',
        //     status: 'borrowed',
        // },
        // {
        //     id: 10,
        //     title: 'Crime and Punishment',
        //     author: 'Fyodor Dostoevsky',
        //     genre: 'Classic',
        //     status: 'available',
        // },
        // { id: 11, title: 'The Odyssey', author: 'Homer', genre: 'Epic', status: 'available' },
        // {
        //     id: 12,
        //     title: 'The Brothers Karamazov',
        //     author: 'Fyodor Dostoevsky',
        //     genre: 'Classic',
        //     status: 'borrowed',
        // },
        // {
        //     id: 13,
        //     title: 'Jane Eyre',
        //     author: 'Charlotte Brontë',
        //     genre: 'Romance',
        //     status: 'available',
        // },
        // {
        //     id: 14,
        //     title: 'Wuthering Heights',
        //     author: 'Emily Brontë',
        //     genre: 'Romance',
        //     status: 'available',
        // },
        // {
        //     id: 15,
        //     title: 'The Divine Comedy',
        //     author: 'Dante Alighieri',
        //     genre: 'Epic',
        //     status: 'available',
        // },
        // {
        //     id: 16,
        //     title: 'The Lord of the Rings',
        //     author: 'J.R.R. Tolkien',
        //     genre: 'Fantasy',
        //     status: 'borrowed',
        // },
        // {
        //     id: 17,
        //     title: 'Don Quixote',
        //     author: 'Miguel de Cervantes',
        //     genre: 'Adventure',
        //     status: 'available',
        // },
        // { id: 18, title: 'Ulysses', author: 'James Joyce', genre: 'Modernist', status: 'available' },
        // { id: 19, title: 'The Iliad', author: 'Homer', genre: 'Epic', status: 'available' },
        // { id: 20, title: 'Anna Karenina', author: 'Leo Tolstoy', genre: 'Classic', status: 'borrowed' },
        // {
        //     id: 21,
        //     title: 'Madame Bovary',
        //     author: 'Gustave Flaubert',
        //     genre: 'Classic',
        //     status: 'available',
        // },
        // {
        //     id: 22,
        //     title: 'The Grapes of Wrath',
        //     author: 'John Steinbeck',
        //     genre: 'Classic',
        //     status: 'available',
        // },
        // {
        //     id: 23,
        //     title: 'Great Expectations',
        //     author: 'Charles Dickens',
        //     genre: 'Classic',
        //     status: 'available',
        // },
        // {
        //     id: 24,
        //     title: 'One Hundred Years of Solitude',
        //     author: 'Gabriel García Márquez',
        //     genre: 'Magical Realism',
        //     status: 'available',
        // },
        // {
        //     id: 25,
        //     title: 'The Sound and the Fury',
        //     author: 'William Faulkner',
        //     genre: 'Modernist',
        //     status: 'borrowed',
        // },
        // { id: 26, title: 'Lolita', author: 'Vladimir Nabokov', genre: 'Classic', status: 'available' },
        // { id: 27, title: 'Catch-22', author: 'Joseph Heller', genre: 'Satire', status: 'available' },
        // {
        //     id: 28,
        //     title: 'The Sun Also Rises',
        //     author: 'Ernest Hemingway',
        //     genre: 'Classic',
        //     status: 'available',
        // },
    ];

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
    return this.books.filter(book => book.owner.id === userId);
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
    return this.books.filter(book => book.owner.id === userId);
  }
}
