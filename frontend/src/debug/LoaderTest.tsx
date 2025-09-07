import React, { useState } from 'react';
import { LoadingSpinner, FormFieldSkeleton, ListItemSkeleton } from '../components/SkeletonLoader';

export default function LoaderTest() {
    const [showFormLoader, setShowFormLoader] = useState(false);
    const [showPageLoader, setShowPageLoader] = useState(false);

    const handleFormSubmit = () => {
        setShowFormLoader(true);
        // Simulate API call
        setTimeout(() => {
            setShowFormLoader(false);
            alert('Form submitted successfully!');
        }, 3000);
    };

    const handlePageLoad = () => {
        setShowPageLoader(true);
        // Simulate page load
        setTimeout(() => {
            setShowPageLoader(false);
        }, 2000);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">🔄 Loader Test Page</h2>
                            
                            {/* Button Loader Test */}
                            <div className="mb-5">
                                <h4>1. Button Loader Test</h4>
                                <p>Click the button below to see the spinner loader:</p>
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handleFormSubmit}
                                    disabled={showFormLoader}
                                >
                                    {showFormLoader ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        'Test Button Loader'
                                    )}
                                </button>
                            </div>

                            {/* Page Loader Test */}
                            <div className="mb-5">
                                <h4>2. Page Loader Test</h4>
                                <p>Click to simulate page loading with skeleton loaders:</p>
                                <button 
                                    className="btn btn-secondary w-100 mb-3"
                                    onClick={handlePageLoad}
                                    disabled={showPageLoader}
                                >
                                    {showPageLoader ? 'Loading...' : 'Test Page Loader'}
                                </button>
                                
                                {showPageLoader ? (
                                    <div>
                                        <h5>Loading Dashboard Stats...</h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <p className="mt-2">Loading stats...</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <div className="spinner-border text-success" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <p className="mt-2">Loading books...</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <div className="spinner-border text-warning" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <p className="mt-2">Loading users...</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h5>Form Field Skeleton Loaders:</h5>
                                        <div className="card">
                                            <div className="card-body">
                                                <FormFieldSkeleton />
                                                <FormFieldSkeleton />
                                                <FormFieldSkeleton />
                                            </div>
                                        </div>
                                        
                                        <h5 className="mt-4">List Item Skeleton Loaders:</h5>
                                        <div className="list-group">
                                            <ListItemSkeleton />
                                            <ListItemSkeleton />
                                            <ListItemSkeleton />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Individual Loader Components */}
                            <div className="mb-5">
                                <h4>3. Individual Loader Components</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Loading Spinner:</h5>
                                        <LoadingSpinner />
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Bootstrap Spinners:</h5>
                                        <div className="d-flex gap-3">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <div className="spinner-border text-success" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <div className="spinner-border text-warning" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="alert alert-info">
                                <h5>📋 How to Test Loaders in Real Forms:</h5>
                                <ol>
                                    <li><strong>AddBookForm</strong>: Go to /add-book, fill form, submit</li>
                                    <li><strong>LendBookForm</strong>: Go to /lend-book, fill form, submit</li>
                                    <li><strong>Login</strong>: Go to /login, try invalid credentials</li>
                                    <li><strong>Dashboard</strong>: Refresh /dashboard to see sidebar stats load</li>
                                    <li><strong>Book Lists</strong>: Go to /total-books-owned, /total-books-borrowed, /total-books-overdue</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
