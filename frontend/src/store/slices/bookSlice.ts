import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch('http://localhost:4000/api/books', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch books');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData: Omit<Book, 'id'>, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch('http://localhost:4000/api/books', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}` 
        },
        body: JSON.stringify(bookData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add book');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, updates }: { id: string; updates: Partial<Book> }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`http://localhost:4000/api/books/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}` 
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        return rejectWithValue('Failed to update book');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { token: string } };
      const response = await fetch(`http://localhost:4000/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      
      if (!response.ok) {
        return rejectWithValue('Failed to delete book');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
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
      // Fetch Books
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
      // Add Book
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
      // Update Book
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      // Delete Book
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id !== action.payload);
        state.totalBooks = Math.max(0, state.totalBooks - 1);
      });
  },
});

export const { clearError, setStats } = booksSlice.actions;
export default booksSlice.reducer;