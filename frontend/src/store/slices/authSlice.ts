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
  fullname: string;
  email: string;
  password: string;
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

// ✅ Complete registration flow: register → login → fetch profile
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: { fullname: string; email: string; password: string }) => {
    try {
      // ✅ Step 1: Register user
      const registerResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Registration successful:', registerResponse);

      if (registerResponse.message === 'User registered') {
        // ✅ Step 2: Auto-login after successful registration
        const loginResponse = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          }),
        });

        console.log('✅ Auto-login successful:', loginResponse);

        if (loginResponse.message === 'Login success' && loginResponse.access_token) {
          // ✅ Store token
          localStorage.setItem('token', loginResponse.access_token);
          
          // ✅ Step 3: Fetch user profile
          const profileResponse = await apiRequest('/auth/me');
          
          console.log('✅ Profile fetched:', profileResponse);

          return {
            token: loginResponse.access_token,
            user: {
              id: profileResponse.user?.sub || profileResponse.user?.id || 0,
              email: profileResponse.user?.email || credentials.email,
              fullname: profileResponse.user?.fullname || credentials.fullname,
            }
          };
        } else {
          throw new Error('Auto-login failed after registration');
        }
      } else {
        throw new Error(registerResponse.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('❌ Registration flow error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }
);

// ✅ Regular login flow
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Login successful:', response);

      if (response.message === 'Login success' && response.access_token) {
        // ✅ Store token
        localStorage.setItem('token', response.access_token);
        
        // ✅ Fetch user profile
        const profileResponse = await apiRequest('/auth/me');
        
        console.log('✅ Profile fetched:', profileResponse);

        return {
          token: response.access_token,
          user: {
            id: profileResponse.user?.sub || profileResponse.user?.id || 0,
            email: profileResponse.user?.email || credentials.email,
            fullname: profileResponse.user?.fullname || credentials.email,
          }
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }
);

// ✅ Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async () => {
    try {
      const response = await apiRequest('/auth/me');
      
      if (response && response.user) {
        return {
          id: response.user.sub || response.user.id,
          email: response.user.email,
          fullname: response.user.fullname,
        };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error: any) {
      console.error('❌ Fetch profile error:', error);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  }
);

// ✅ Logout user
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
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Register user cases (now includes complete flow)
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ User is now fully authenticated after registration
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      
      // ✅ Login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      
      // ✅ Fetch user profile cases
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
        state.error = action.error.message || 'Failed to fetch user profile';
      })
      
      // ✅ Logout user cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, clearAuth, setToken } = authSlice.actions;
export default authSlice.reducer;