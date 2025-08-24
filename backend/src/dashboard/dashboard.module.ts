import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { JwtModule } from '@nestjs/jwt';
import { BooksModule } from '../books/books.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "../books/book.entity"; // Import BooksModule to access book data

@Module({
   imports: [
     JwtModule.registerAsync({
         useFactory: () => ({
             secret: process.env.JWT_SECRET, // Use env variable in production
             signOptions: { expiresIn: '1h' },
         }),
    }),
    TypeOrmModule.forFeature([Book]),
    BooksModule],

  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
