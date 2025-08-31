import {Controller, Get, UseGuards, Req, Query} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { BooksService } from "../books/books.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Request } from 'express';
import { AuthenticatedRequest } from './interfaces/authenticated.request';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService,
              private readonly booksService: BooksService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }
  @UseGuards(AuthGuard)
  @Get('borrowed')
  getUserBorrowedBooks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.dashboardService.getBorrowedBooksByUser(userId);
  }
  @UseGuards(AuthGuard)
  @Get('owned')
  async getOwnedBooks(@Req() req: AuthenticatedRequest, @Query('page') page = '1',
                      @Query('limit') limit = '10') {
    // Assuming req.user.sub is set by JwtAuthGuard
    return this.dashboardService.getOwnedBooksByUser(req.user.sub, +page, +limit);
  }

  @UseGuards(AuthGuard)
  @Get('overdue')
  getOverdue(@Req() req: AuthenticatedRequest) {
    // Implement logic in the service as needed
    return this.dashboardService.getOverdueBooksByUser(req.user.sub);
  }

}
