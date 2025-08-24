// import { useState, useEffect, createContext, useContext } from 'react';
// import { loginUser, registerUser, getMe } from '../services/auth';

// interface User {
//   id: number;
//   email: string;
//   fullname: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (fullname: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
//   error: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user info when token changes
//   useEffect(() => {
//     if (token) {
//       fetchUserInfo();
//     } else {
//       setIsLoading(false);
//     }
//   }, [token]);

//   const fetchUserInfo = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const userData = await getMe();
//       setUser(userData);
//     } catch (err) {
//       console.error('Failed to fetch user info:', err);
//       setError('Failed to fetch user info');
//       // If token is invalid, clear it
//       logout();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await loginUser({ email, password });
      
//       if (response.access_token) {
//         localStorage.setItem('token', response.access_token);
//         setToken(response.access_token);
//         setUser(response.user);
//       } else {
//         throw new Error('No access token received');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Login failed');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (fullname: string, email: string, password: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await registerUser({ fullname, email, password });
//     } catch (err: any) {
//       setError(err.message || 'Registration failed');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     setError(null);
//   };

//   const value: AuthContextType = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     isLoading,
//     error,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
export {}