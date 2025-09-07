import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface DashboardStats {
  totalBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
  recentBooks: Array<{
    id: string;
    title: string;
    author: string;
    status: 'available' | 'borrowed';
    coverUrl?: string;
    addedDate?: string;
  }>;
  recentLending: Array<{
    id: string;
    bookTitle: string;
    borrowerName: string;
    borrower?: any;
    lendDate: string;
    expectedReturnDate?: string;
    actualReturnDate?: string;
    status: 'lent' | 'returned';
  }>;
}

interface DashboardState {
  stats: DashboardStats;
  ownedBooks: {
    books: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  borrowedBooks: {
    books: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  overdueBooks: {
    lendingRecords: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    recentBooks: [],
    recentLending: [],
  },
  ownedBooks: {
    books: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  borrowedBooks: {
    books: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  overdueBooks: {
    lendingRecords: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

// ✅ Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/dashboard/stats');
      console.log(response);
      const totalBooks = response.data?.length || response.length || 0;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

// ✅ Async thunk to get user's owned books with pagination
export const getUserOwnedBooks = createAsyncThunk(
  'dashboard/getUserOwned',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/api/dashboard/owned?page=${params.page}&limit=${params.limit}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user books');
    }
  }
);

// ✅ Async thunk to get borrowed books with pagination
export const getBorrowedBooks = createAsyncThunk(
  'dashboard/getBorrowed',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/api/dashboard/borrowed?page=${params.page}&limit=${params.limit}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch borrowed books');
    }
  }
);

// ✅ Async thunk to get overdue books with pagination
export const getOverdueBooks = createAsyncThunk(
  'dashboard/getOverdue',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/api/dashboard/overdue?page=${params.page}&limit=${params.limit}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch overdue books');
    }
  }
);

// ✅ Async thunk to refresh specific stats
export const refreshDashboardStats = createAsyncThunk(
  'dashboard/refreshStats',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Fetch updated stats
      await dispatch(fetchDashboardData());
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh stats');
    }
  }
);

// ✅ Async thunk to fetch recent activity
export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/api/dashboard/recent-activity?limit=${limit}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch recent activity');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: (state) => {
      state.stats = initialState.stats;
      state.lastUpdated = null;
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    incrementTotalBooks: (state) => {
      state.stats.totalBooks += 1;
      state.lastUpdated = new Date().toISOString();
    },
    decrementTotalBooks: (state) => {
      state.stats.totalBooks = Math.max(0, state.stats.totalBooks - 1);
      state.lastUpdated = new Date().toISOString();
    },
    // updateBookStatus: (state, action: PayloadAction<{ bookId: string; newStatus: 'available' | 'borrowed' }>) => {
    //   const { bookId, newStatus } = action.payload;
      
    //   // Update book status in recent books
    //   const book = state.stats.recentBooks.find(b => b.id === bookId);
    //   if (book) {
    //     book.status = newStatus;
    //   }
      
    //   // Update counts
    //   if (newStatus === 'borrowed') {
    //     state.stats.borrowedBooks += 1;
    //   } else {
    //     state.stats.borrowedBooks = Math.max(0, state.stats.borrowedBooks - 1);
    //   }
      
    //   state.lastUpdated = new Date().toISOString();
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload.data || action.payload || {};
        state.stats = {
          totalBooks: payload.totalBooks || 0,
          borrowedBooks: payload.borrowedBooks || 0,
          overdueBooks: payload.overdueBooks || 0,
          recentBooks: payload.recentBooks || [],
          recentLending: payload.recentLending || [],
        };
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get User Owned Books
      .addCase(getUserOwnedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOwnedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.ownedBooks = action.payload;
        state.stats.totalBooks = action.payload.total || 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getUserOwnedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Borrowed Books
      .addCase(getBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBorrowedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowedBooks = action.payload;
        state.stats.borrowedBooks = action.payload.total || 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getBorrowedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Overdue Books
      .addCase(getOverdueBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOverdueBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueBooks = action.payload;
        state.stats.overdueBooks = action.payload.total || 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getOverdueBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh Stats
      .addCase(refreshDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshDashboardStats.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.recentBooks = action.payload.recentBooks || [];
        state.stats.recentLending = action.payload.recentLending || [];
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearDashboard,
  updateStats,
  incrementTotalBooks,
  decrementTotalBooks,
  // updateBookStatus,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;