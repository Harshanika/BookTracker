import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';
import { LendingRecord } from '../lending/lending.entity';
import { AppDataSource } from '../data-source';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const bookRepo = AppDataSource.getRepository(Book);
  const lendingRepo = AppDataSource.getRepository(LendingRecord);

  const user = userRepo.create({
    name: 'Alice',
    email: 'alice@example.com',
    passwordHash: 'hashedpassword',
    createdAt: new Date(),
  });
  await userRepo.save(user);

  const book = bookRepo.create({
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    status: 'available',
  });
  await bookRepo.save(book);

  const lending = lendingRepo.create({
    book,
    borrower: user,
    lendDate: new Date(),
    expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });
  await lendingRepo.save(lending);

  console.log('✅ Seed completed');
  process.exit(0);
}

seed();
