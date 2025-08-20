import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LendingRecord } from '../lending/lending.entity';
import { Book } from '../books/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LendingRecord, Book])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // so Auth can use it
})
export class UsersModule {}
