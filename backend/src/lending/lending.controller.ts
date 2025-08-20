import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { LendingService } from './lending.service';

@Controller('lending')
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Post()
  lendBook(
    @Body()
    dto: {
      bookId: number;
      borrowerName: string;
      lendDate: Date;
      expectedReturnDate?: Date;
    },
  ) {
    return this.lendingService.lendBook(dto);
  }

  @Patch(':id/return')
  markReturned(@Param('id') id: string) {
    return this.lendingService.markReturned(+id);
  }

  @Get(':bookId/history')
  getHistory(@Param('bookId') bookId: string) {
    return this.lendingService.getHistory(+bookId);
  }

  @Get('active')
  getActiveBorrowings() {
    return this.lendingService.getActiveBorrowings();
  }
}
