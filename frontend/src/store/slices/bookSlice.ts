import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  coverUrl?: string;
  status: 'available' | 'borrowed';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface AddBookRequest {
  title: string;
  author: string;
  genre: string;
  status: 'available' | 'borrowed';
  description?: string;
  coverUrl?: string;
}

interface BooksState {
  books: Book[];
  userBooks: Book[];
  loading: boolean;
  error: string | null;
  addBookLoading: boolean;
  addBookError: string | null;
}

const initialState: BooksState = {
  books: [],
  userBooks: [],
  loading: false,
  error: null,
  addBookLoading: false,
  addBookError: null,
};

// ✅ Add book to user's personal library
export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData: AddBookRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/books/add', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
      
      console.log('✅ Book added successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to add book:', error);
      return rejectWithValue(error.message || 'Failed to add book');
    }
  }
);

// ✅ Fetch user's personal books
export const fetchUserBooks = createAsyncThunk(
  'books/fetchUserBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/books/my-books', {
        method: 'GET',
      });
      
      console.log('✅ User books fetched:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch user books:', error);
      return rejectWithValue(error.message || 'Failed to fetch user books');
    }
  } 
);

// ✅ Fetch all books (for admin or public view)
export const fetchAllBooks = createAsyncThunk(
  'books/fetchAllBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/books', {
        method: 'GET',  
      });
      
      console.log('✅ All books fetched:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch all books:', error);
      return rejectWithValue(error.message || 'Failed to fetch all books');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooksError: (state) => {
      state.error = null;
      state.addBookError = null;
    },
    clearBooks: (state) => {
      state.books = [];
      state.userBooks = [];
    },
  },
  extraReducers: (builder) => {
    // Add Book
    builder
      .addCase(addBook.pending, (state) => {
        state.addBookLoading = true;
        state.addBookError = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.addBookLoading = false;
        state.addBookError = null;
        // ✅ Add the new book to user's books
        if (action.payload) {
          state.userBooks.unshift(action.payload);
        }
      })
      .addCase(addBook.rejected, (state, action) => {
        state.addBookLoading = false;
        state.addBookError = action.payload as string || 'Failed to add book';
      });

    // Fetch User Books
    builder
      .addCase(fetchUserBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userBooks = action.payload || [];
      })
      .addCase(fetchUserBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch user books';
      });

    // Fetch All Books
    builder
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.books = action.payload || [];
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch all books';
      });
  },
});

export const { clearBooksError, clearBooks } = booksSlice.actions;
export default booksSlice.reducer;