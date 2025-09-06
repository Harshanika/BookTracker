import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

interface UserState {
  users: User[];
  usersLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  usersLoading: false,
  error: null,
};

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/users');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    updateUsers: (state, action: PayloadAction<Partial<User>>) => {
      state.users = [...state.users, action.payload as User];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearUsers, updateUsers } = userSlice.actions;
export default userSlice.reducer;