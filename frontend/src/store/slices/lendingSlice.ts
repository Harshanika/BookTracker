import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface LendingRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  lendDate: string;
  expectedReturnDate?: string;
  returnDate?: string;
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

// Async thunks
export const fetchLendingHistory = createAsyncThunk(
  'lending/fetchHistory',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch('http://localhost:4000/api/lending/history', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch lending history');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const lendBook = createAsyncThunk(
  'lending/lendBook',
  async (lendingData: { bookId: string; borrowerName: string; expectedReturnDate?: string }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch('http://localhost:4000/api/books/lend', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}` 
        },
        body: JSON.stringify(lendingData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to lend book');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const returnBook = createAsyncThunk(
  'lending/returnBook',
  async (lendingId: string, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`http://localhost:4000/api/lending/${lendingId}/return`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      
      if (!response.ok) {
        return rejectWithValue('Failed to return book');
      }
      
      return lendingId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
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
      // Fetch History
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
      // Lend Book
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
      // Return Book
      .addCase(returnBook.fulfilled, (state, action) => {
        const record = state.lendingRecords.find(r => r.id === action.payload);
        if (record) {
          record.status = 'returned';
          record.returnDate = new Date().toISOString();
        }
      });
  },
});

export const { clearError } = lendingSlice.actions;
export default lendingSlice.reducer;