import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { LendingService } from './lending.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('lending')
@UseGuards(AuthGuard)
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @UseGuards(AuthGuard)
  @Post('book')
  async lendBook(
    @Body() lendingData: { bookId: string; borrowerName?: string; borrowerId?: number; lendDate?: string; expectedReturnDate?: string },
  ) {
    return this.lendingService.lendBook(
      Number(lendingData.bookId),
      lendingData.borrowerName,
      lendingData.borrowerId,
      lendingData.lendDate ? new Date(lendingData.lendDate) : undefined,
      lendingData.expectedReturnDate ? new Date(lendingData.expectedReturnDate) : undefined
    );
  }

  // @UseGuards(AuthGuard)
  // @Get('history')
  // async getLendingHistory() {
  //   return this.lendingService.getUserLendingHistory();
  // }

  // @UseGuards(AuthGuard)
  // @Patch(':id/return')
  // async markReturned(@Param('id') id: string) {
  //   return this.lendingService.markReturned(+id);
  // }

  // @UseGuards(AuthGuard)
  // @Get('active')
  // async getActiveBorrowings() {
  //   return this.lendingService.getUserActiveBorrowings();
  // }
}
