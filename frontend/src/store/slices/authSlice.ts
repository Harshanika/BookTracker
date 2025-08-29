import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface User {
  id: number;
  email: string;
  fullname: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    sub: number;
    email: string;
    fullname: string;
  };
}

interface RegisterResponse {
  message: string;
  access_token: string;
  user: {
    sub: number;
    email: string;
    fullname: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// ✅ Fixed login thunk to work with your apiRequest function
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // ✅ Your apiRequest returns the parsed data directly
      const data: LoginResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('✅ Login successful:', data);
      
      // ✅ Store access_token in localStorage
      localStorage.setItem('token', data.access_token);
      
      // ✅ Return the token (we'll fetch complete user profile with auth/me)
      return { token: data.access_token };
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// ✅ Fixed register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { fullname: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const data: RegisterResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('✅ Registration successful:', data);
      
      // ✅ Store access_token in localStorage
      localStorage.setItem('token', data.access_token);
      
      return { token: data.access_token };
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// ✅ Fixed fetchUserProfile to work with your apiRequest function
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ Your apiRequest returns the parsed data directly
      const userData = await apiRequest('/auth/me', {
        method: 'GET',
      });
      
      console.log('✅ User profile fetched:', userData);
      
      // ✅ Transform backend user data to match our interface
      return {
        id: userData.sub || userData.id,
        email: userData.email,
        fullname: userData.fullname
      };
    } catch (error: any) {
      console.error('❌ Failed to fetch user profile:', error);
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// ✅ Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;