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

  @UseGuards(AuthGuard)
  @Get('stats')
  getStats(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getStats(req.user.sub);
  }
  
  @UseGuards(AuthGuard)
  @Get('borrowed')
  async getUserBorrowedBooks(
    @Req() req: AuthenticatedRequest, 
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const userId = req.user.sub;
    return this.dashboardService.getBorrowedBooksByUser(userId, +page, +limit);
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
  async getOverdue(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.dashboardService.getOverdueBooksByUser(req.user.sub, +page, +limit);
  }

  @UseGuards(AuthGuard)
  @Get('recent-activity')
  async getRecentActivity(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit = '10'
  ) {
    return this.dashboardService.getRecentActivity(req.user.sub, +limit);
  }

}
