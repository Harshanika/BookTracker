import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";
import AuthLayout from "../../components/AuthLayout";
import { useFormValidation } from "../../hooks/useFormValidation";
import { loginSchema, LoginFormData } from "../../schemas/validationSchemas";
import { EmailField, PasswordField } from "../../components/FormField";
import { LoadingSpinner } from "../../components/SkeletonLoader";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);
    
    const form = useFormValidation<LoginFormData>({
        schema: loginSchema,
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange'
    });

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

    const handleSubmit = async (data: LoginFormData) => {
        try {
            // Step 1: Login to get token
            const loginResult = await dispatch(loginUser({ 
                email: data.email, 
                password: data.password 
            })).unwrap();
            
            // if (loginResult.token) {
            //     // Step 2: Fetch complete user profile with the token
            //     await dispatch(fetchUserProfile()).unwrap();
                
            //     // Navigation will happen automatically via useEffect
            // }
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

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <EmailField
                            form={form}
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            required
                        />

                        <PasswordField
                            form={form}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            required
                        />

                        {/* ✅ Use Redux loading state */}
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading || !form.formState.isValid}
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