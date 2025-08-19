import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from 'typeorm';
import { Book } from "../books/book.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Book, (book) => book.owner)
    books!: Book[];   // 👈 All books owned by this user

}
