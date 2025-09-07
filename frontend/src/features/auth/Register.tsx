import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearError } from "../../store/slices/authSlice";
import AuthLayout from "../../components/AuthLayout";
import { useFormValidation } from "../../hooks/useFormValidation";
import { registerSchema, RegisterFormData } from "../../schemas/validationSchemas";
import { TextField, EmailField, PasswordField } from "../../components/FormField";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const form = useFormValidation<RegisterFormData>({
        schema: registerSchema,
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange'
    });

    // Clear any previous errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handle successful registration
    const { isAuthenticated, user, error, loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (data: RegisterFormData) => {
        try {
            // ✅ This now handles: register → login → fetch profile
            await dispatch(registerUser({ 
                fullname: data.fullname, 
                email: data.email, 
                password: data.password 
            })).unwrap();
            
            // ✅ Clear form on success
            form.reset();
            
            // ✅ User is now authenticated, navigate to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            // Error is handled by Redux state
            console.error("Registration failed:", error);
        }
    };


    return (
        <AuthLayout>
            <div className="card shadow-lg">
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="heading-2 text-gradient">Create Account</h2>
                        <p className="text-body text-muted">
                            Join SimpleLibrary to start managing your books
                        </p>
                    </div>

                    {/* ✅ Display Redux error state */}
                    {error && (
                        <div className="alert alert-danger">
                            <strong>Registration Error:</strong> {error}
                        </div>
                    )}

                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <TextField
                            form={form}
                            name="fullname"
                            label="Full Name"
                            placeholder="Enter your full name"
                            required
                        />

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

                        <PasswordField
                            form={form}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted">
                            Already have an account?{" "}
                            <a href="/login" className="text-decoration-none">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}