import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import {JwtModule} from "@nestjs/jwt";
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule.registerAsync({
      useFactory: () => ({
          secret: process.env.JWT_SECRET, // Use env variable in production
          signOptions: { expiresIn: '1h' },
      }),
  }),TypeOrmModule.forFeature([Book]),
  TypeOrmModule.forFeature([User]),
  UsersModule],
  providers: [BooksService],
  controllers: [BooksController],
  exports: [BooksService], // <-- Add this line
})
export class BooksModule {}
