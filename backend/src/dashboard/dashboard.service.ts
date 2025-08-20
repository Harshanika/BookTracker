import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getStats() {
    return {
      totalBooks: 10,
      borrowedBooks: 3,
      overdueBooks: 1,
    };
  }
}
