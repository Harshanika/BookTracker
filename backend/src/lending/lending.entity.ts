import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Entity()
export class LendingRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Book, (book) => book.lendingRecords)
  book!: Book;

  @ManyToOne(() => User, { nullable: true })
  borrower?: User; // if borrower is a registered user

  @Column({ nullable: true })
  borrowerName?: string; // if borrower is not registered

  @Column()
  lendDate!: Date;

  @Column({ nullable: true })
  expectedReturnDate?: Date;

  @Column({ nullable: true })
  actualReturnDate?: Date;

  @Column({ nullable: true })
  returnNote?: string;
}
