import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LendingRecord } from './lending.entity';
import { Book } from '../books/book.entity';
import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LendingRecord, Book])],
    providers: [LendingService],
    controllers: [LendingController],
})
export class LendingModule {}
