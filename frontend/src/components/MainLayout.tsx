import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchUserProfile, logoutUser } from "../store/slices/authSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Use auth slice for both user data and authentication
    const { user, loading, error, isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        // ✅ Check if user is authenticated first
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // ✅ If authenticated but no user data, fetch profile
        if (isAuthenticated && !user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, isAuthenticated, user, navigate]);

    // ✅ Handle logout with Redux
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            // ✅ Redux will automatically clear the state
            // ✅ The useEffect above will detect isAuthenticated is false and redirect
        } catch (error) {
            console.error("Logout failed:", error);
            // ✅ Fallback: manually redirect if Redux fails
            navigate("/login");
        }
    };

    // ✅ Show loading while fetching user data
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // ✅ Show error if profile fetch failed
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="alert alert-danger">
                        <h4>Error Loading Profile</h4>
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => dispatch(fetchUserProfile())}
                        >
                            Try Again
                        </button>
                        <button 
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ If no user data after loading, redirect to login
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header username={user.fullname} />
            <div className="container py-8">
                <div className="flex gap-8">
                    <Sidebar />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}