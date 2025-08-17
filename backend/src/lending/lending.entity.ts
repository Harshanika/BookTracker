import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from '../books/book.entity';

@Entity()
export class LendingRecord {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Book, (book) => book.lendingRecords)
    book!: Book;

    @Column()
    borrowerName!: string;

    @Column()
    lendDate!: Date;

    @Column({ nullable: true })
    expectedReturnDate?: Date;

    @Column({ nullable: true })
    actualReturnDate?: Date;
}