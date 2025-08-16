import { Injectable } from '@nestjs/common';

interface Book {
  id: number;
  title: string;
  author: string;
}

@Injectable()
export class BooksService {
  private books: Book[] = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { id: 3, title: '1984', author: 'George Orwell' },
      { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen' },
      { id: 5, title: 'Moby-Dick', author: 'Herman Melville' },
      { id: 6, title: 'War and Peace', author: 'Leo Tolstoy' },
      { id: 7, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
      { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { id: 9, title: 'Brave New World', author: 'Aldous Huxley' },
      { id: 10, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky' },
      { id: 11, title: 'The Odyssey', author: 'Homer' },
      { id: 12, title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky' },
      { id: 13, title: 'Jane Eyre', author: 'Charlotte Brontë' },
      { id: 14, title: 'Wuthering Heights', author: 'Emily Brontë' },
      { id: 15, title: 'The Divine Comedy', author: 'Dante Alighieri' },
      { id: 16, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
      { id: 17, title: 'Don Quixote', author: 'Miguel de Cervantes' },
      { id: 18, title: 'Ulysses', author: 'James Joyce' },
      { id: 19, title: 'The Iliad', author: 'Homer' },
      { id: 20, title: 'Anna Karenina', author: 'Leo Tolstoy' },
      { id: 21, title: 'Madame Bovary', author: 'Gustave Flaubert' },
      { id: 22, title: 'The Grapes of Wrath', author: 'John Steinbeck' },
      { id: 23, title: 'Great Expectations', author: 'Charles Dickens' },
      { id: 24, title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez' },
      { id: 25, title: 'The Sound and the Fury', author: 'William Faulkner' },
      { id: 26, title: 'Lolita', author: 'Vladimir Nabokov' },
      { id: 27, title: 'Catch-22', author: 'Joseph Heller' },
      { id: 28, title: 'The Sun Also Rises', author: 'Ernest Hemingway' }
  ];
  private nextId = 4;

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  create(book: Omit<Book, 'id'>): Book {
    const newBook: Book = { id: this.nextId++, ...book };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, update: Partial<Omit<Book, 'id'>>): Book | undefined {
    const book = this.findOne(id);
    if (!book) return undefined;
    Object.assign(book, update);
    return book;
  }

  remove(id: number): boolean {
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) return false;
    this.books.splice(index, 1);
    return true;
  }
}
