// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Book } from './books/book.entity';
import { LendingRecord } from './lending/lending.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'db', // docker service name
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'booktracker',
    synchronize: true, // ❌ disable for production, use migrations instead
    logging: true,
    entities: [User, Book, LendingRecord],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
