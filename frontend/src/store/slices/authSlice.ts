import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { setSecureToken, getSecureToken } from '../../services/api';

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    sub: number;
    email: string;
    fullname: string;
  };
}

interface UserProfile {
  id: number;
  email: string;
  fullname: string;
}

interface RegisterResponse {
  message: string;
  fullname: string;
  email: string;
  password: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

// ✅ Complete registration flow: register → login → fetch profile
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: { fullname: string; email: string; password: string }, { rejectWithValue }) => {
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

        // ✅ Use 'access_token' to match backend response
        if (loginResponse.message === 'Login success' && loginResponse.access_token) {
          // ✅ Store token securely using the correct name
          setSecureToken(loginResponse.access_token);
          
          // ✅ Step 3: Fetch user profile
          const profileResponse = await apiRequest('/auth/me');
          
          console.log('✅ Profile fetched:', profileResponse);

          return {
            token: loginResponse.access_token, // ✅ This matches backend 'access_token'
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
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// ✅ Regular login flow
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login with:', credentials.email);
      
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Login response:', response);

      if (response.message === 'Login success' && response.access_token) {
        console.log('🔑 Token received:', response.access_token.substring(0, 20) + '...');
        
        // ✅ Store token securely
        setSecureToken(response.access_token);
        
        // ✅ Verify token is stored
        const storedToken = getSecureToken();
        console.log('💾 Token stored successfully:', !!storedToken);
        
        // ✅ Fetch user profile with detailed logging
        console.log('👤 Attempting to fetch user profile...');
        const profileResponse = await apiRequest('/auth/me');
        
        console.log('✅ Profile response:', profileResponse);

        if (profileResponse) {
          return {
            token: response.access_token,
            user: {
              id: profileResponse.sub || profileResponse.id || 0,
              email: profileResponse.email,
              fullname: profileResponse.fullname,
            }
          };
        } else {
          console.error('❌ Profile response missing user data:', profileResponse);
          throw new Error('User profile data is incomplete');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// ✅ Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('👤 Fetching user profile...');
      
      // ✅ Check if we have a token
      const token = getSecureToken();
      console.log('🔑 Current token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await apiRequest('/auth/me');
      console.log('✅ Profile API response:', response);
      
      if (response) {
        return {
          id: response.sub || response.id,
          email: response.email,
          fullname: response.fullname,
        };
      } else {
        console.error('❌ Invalid profile response structure:', response);
        throw new Error('Invalid user profile data structure');
      }
    } catch (error: any) {
      console.error('❌ Fetch profile error:', error);
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// ✅ Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    localStorage.removeItem('access_token');
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
      localStorage.removeItem('access_token');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload);
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
        // state.token = action.payload.token;
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