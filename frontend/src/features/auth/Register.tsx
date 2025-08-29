import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearError } from "../../store/slices/authSlice";
import AuthLayout from "../../components/AuthLayout";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(""); // ✅ Add missing state

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // ✅ Clear previous password error
        setPasswordError("");

        // ✅ Validate password confirmation
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        // ✅ Validate password length
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }

        try {
            await dispatch(registerUser({ fullname: name, email, password })).unwrap();
            
            // Clear form on success
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
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

                    {/* ✅ Display password validation error */}
                    {passwordError && (
                        <div className="alert alert-warning">
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                minLength={6}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                minLength={6}
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