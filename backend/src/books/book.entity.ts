import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { LendingRecord } from '../lending/lending.entity';

/**
 * Represents a book in the library.
 * @property title - Title of the book.
 * @property author - Author of the book.
 * @property status - Availability (AVAILABLE, BORROWED).
 */
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column({ nullable: true })
  genre!: string;

  @Column({ default: 'available' })
  status!: 'available' | 'borrowed';

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.id)
  owner!: User;

  @OneToMany(() => LendingRecord, (record) => record.book)
  lendingRecords!: LendingRecord[];
}
