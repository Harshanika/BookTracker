import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { LendingService } from './lending.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthenticatedRequest } from '../dashboard/interfaces/authenticated.request';

@Controller('lending')
@UseGuards(AuthGuard)
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Get('history')
  async getLendingHistory(@Req() req: AuthenticatedRequest) {
    return this.lendingService.getUserLendingHistory(req.user.sub);
  }

  @Patch(':id/return')
  async markReturned(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.lendingService.markReturned(+id, req.user.sub);
  }

  @Get('active')
  async getActiveBorrowings(@Req() req: AuthenticatedRequest) {
    return this.lendingService.getUserActiveBorrowings(req.user.sub);
  }
}
