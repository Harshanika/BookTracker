import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { LendingRecord } from '../lending/lending.entity';


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

    @ManyToOne(() => User, user => user.id)
    owner!: User;

    @OneToMany(() => LendingRecord, (record) => record.book)
    lendingRecords!: LendingRecord[];


}