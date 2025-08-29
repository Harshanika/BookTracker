import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, fetchUserProfile, clearError } from "../../store/slices/authSlice";
import AuthLayout from "../../components/AuthLayout";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

    // Clear any previous errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handle successful authentication
    useEffect(() => {
        if (isAuthenticated && user) {
            // Navigate to dashboard after successful login
            navigate("/dashboard");
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            return;
        }

        try {
            // Step 1: Login to get token
            const loginResult = await dispatch(loginUser({ email, password })).unwrap();
            
            if (loginResult.token) {
                // Step 2: Fetch complete user profile with the token
                // await dispatch(fetchUserProfile()).unwrap();
                
                // Navigation will happen automatically via useEffect
            }
        } catch (error) {
            // Error is already handled by the Redux slice
            console.error('Login failed:', error);
        }
    };

    return (
        <AuthLayout>
            <div className="card shadow-lg">
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="heading-2 text-gradient">Welcome Back</h2>
                        <p className="text-body text-muted">
                            Sign in to access your library
                        </p>
                    </div>

                    {/* ✅ Display Redux error state */}
                    {error && (
                        <div className="alert alert-danger">
                            <strong>Login Error:</strong> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </div>

                        {/* ✅ Use Redux loading state */}
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted">
                            Don't have an account?{" "}
                            <a href="/register" className="text-decoration-none">
                                Create one here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}