import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: 'available' | 'borrowed';
  coverUrl?: string;
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  totalBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  totalBooks: 0,
  borrowedBooks: 0,
  overdueBooks: 0,
};

// ✅ Use apiRequest instead of manual fetch
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      const data = await apiRequest('api/books');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData: Omit<Book, 'id'>, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      const data = await apiRequest('api/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, updates }: { id: string; updates: Partial<Book> }, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      const data = await apiRequest(`api/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string, { rejectWithValue }) => {
    try {
      // ✅ apiRequest automatically includes the token
      await apiRequest(`api/books/${id}`, {
        method: 'DELETE',
      });
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete book');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStats: (state, action: PayloadAction<{ total: number; borrowed: number; overdue: number }>) => {
      state.totalBooks = action.payload.total;
      state.borrowedBooks = action.payload.borrowed;
      state.overdueBooks = action.payload.overdue;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
        state.totalBooks += 1;
        state.error = null;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id !== action.payload);
        state.totalBooks = Math.max(0, state.totalBooks - 1);
      });
  },
});

export const { clearError, setStats } = booksSlice.actions;
export default booksSlice.reducer;