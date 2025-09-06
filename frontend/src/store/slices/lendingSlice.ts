import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface LendingRecord {
  id: number;
  bookId: number;
  book: {
    id: number;
    title: string;
    author: string;
    genre?: string;
  };
  borrowerName?: string;
  lendDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  status: 'lent' | 'returned' | 'overdue';
}

interface LendingState {
  lendingRecords: LendingRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: LendingState = {
  lendingRecords: [],
  loading: false,
  error: null,
};

// ✅ Use apiRequest instead of manual fetch
export const fetchLendingHistory = createAsyncThunk(
  'lending/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      const data = await apiRequest('/lending/history');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const lendBook = createAsyncThunk(
  'lending/lendBook',
  async (lendingData: { bookId: string; borrowerName: string; lendDate: string; expectedReturnDate?: string }, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      const data = await apiRequest('/api/lending/book', {
        method: 'POST',
        body: JSON.stringify(lendingData),
      });
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to lend book');
    }
  }
);

export const returnBook = createAsyncThunk(
  'lending/returnBook',
  async (lendingId: string, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      await apiRequest(`/api/lending/${lendingId}/return`, {
        method: 'PUT',
      });
      
      return lendingId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to return book');
    }
  }
);

export const fetchActiveBorrowings = createAsyncThunk(
  'lending/fetchActiveBorrowings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/lending/active');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active borrowings');
    }
  }
);

const lendingSlice = createSlice({
  name: 'lending',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLendingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLendingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.lendingRecords = action.payload;
        state.error = null;
      })
      .addCase(fetchLendingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(lendBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(lendBook.fulfilled, (state, action) => {
        state.loading = false;
        state.lendingRecords.push(action.payload);
        state.error = null;
      })
      .addCase(lendBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        // const record = state.lendingRecords.find(r => r.id === action.payload);
        // if (record) {
        //   record.status = 'returned';
        //   record.actualReturnDate = new Date().toISOString();
        // }
      })
      .addCase(fetchActiveBorrowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBorrowings.fulfilled, (state, action) => {
        state.loading = false;
        state.lendingRecords = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveBorrowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = lendingSlice.actions;
export default lendingSlice.reducer;