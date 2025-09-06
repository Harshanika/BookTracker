import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LendingRecord } from './lending.entity';
import { Book } from '../books/book.entity';
import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: () => ({
        secret: process.env.JWT_SECRET, // Use env variable in production
        signOptions: { expiresIn: '1h' },
    }),
}),TypeOrmModule.forFeature([LendingRecord, Book, User])],
  providers: [LendingService],
  controllers: [LendingController],
})
export class LendingModule {}
