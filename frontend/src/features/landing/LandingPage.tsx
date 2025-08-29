import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-primary">
            {/* Header */}
            <header className="bg-white shadow-soft">
                <div className="container">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="text-4xl">📚</div>
                            <h1 className="ml-3 heading-3 text-gradient">SimpleLibrary</h1>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-outline"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="btn-primary"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container section">
                <div className="text-center">
                    <h1 className="heading-1 mb-6">
                        <span className="block">Manage Your</span>
                        <span className="text-gradient">Personal Library</span>
                    </h1>
                    <p className="text-body max-w-3xl mx-auto mb-8">
                        Track your books, manage lending, and never lose track of borrowed books again. 
                        Simple, powerful, and designed for book lovers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* ✅ Use navigate instead of href */}
                        <button
                            onClick={() => navigate("/register")}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Start Managing Your Library
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="btn-secondary text-lg px-8 py-4"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-32">
                    <div className="grid">
                        <div className="card text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-500 text-white text-2xl mx-auto mb-4">
                                📖
                            </div>
                            <h3 className="heading-4 mb-3">Book Management</h3>
                            <p className="text-body">
                                Add, edit, and organize your book collection with ease.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-500 text-white text-2xl mx-auto mb-4">
                                🤝
                            </div>
                            <h3 className="heading-4 mb-3">Lending System</h3>
                            <p className="text-body">
                                Track who borrowed your books and when they're due back.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-500 text-white text-2xl mx-auto mb-4">
                                📊
                            </div>
                            <h3 className="heading-4 mb-3">Smart Dashboard</h3>
                            <p className="text-body">
                                Get insights into your library with detailed statistics.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}