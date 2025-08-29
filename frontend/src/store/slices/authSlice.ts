import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

interface User {
  id: number; // ✅ Changed to number based on your backend
  email: string;
  fullname: string; // ✅ Changed from 'name' to 'fullname'
}

interface LoginResponse {
  message: string;
  access_token: string; // ✅ Changed from 'token' to 'access_token'
  user: {
    sub: number; // ✅ Backend returns 'sub' instead of 'id'
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

// ✅ Updated login thunk to handle your backend response
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Step 1: Call auth/login to get token
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      console.log(response);

      const data: LoginResponse = await response.json();
      
      // ✅ Store access_token in localStorage
      localStorage.setItem('token', data.access_token);
      
      // ✅ Return the token (we'll fetch complete user profile with auth/me)
      return { token: data.access_token };
    } catch (error) {
      console.error('Login failed:', error);
      return rejectWithValue('Network error occurred');
    }
  }
);

// ✅ Updated register thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { fullname: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Registration failed');
      }

      const data: RegisterResponse = await response.json();
      
      // ✅ Store access_token in localStorage
      localStorage.setItem('token', data.access_token);
      
      return { token: data.access_token };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// ✅ Updated fetchUserProfile to call auth/me with token
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Step 2: Call auth/me with the token in header
      const response = await apiRequest('/auth/me', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch user profile');
      }

      const userData: User = await response.json();
      
      // ✅ Transform backend user data to match our interface
      return {
        // id: userData.sub || userData.id,
        email: userData.email,
        fullname: userData.fullname
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
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
        // ✅ Don't set user yet - we'll fetch it with auth/me
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
        // ✅ Don't set user yet - we'll fetch it with auth/me
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
        // state.user = action.payload;
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