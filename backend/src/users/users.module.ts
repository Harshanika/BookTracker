import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LendingRecord } from '../lending/lending.entity';
import { Book } from '../books/book.entity';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: () => ({
        secret: process.env.JWT_SECRET, // Use env variable in production
        signOptions: { expiresIn: '1h' },
    }),
}),TypeOrmModule.forFeature([User, LendingRecord, Book])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // so Auth can use it
})
export class UsersModule {}
