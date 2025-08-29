import React, { useEffect } from "react";
import DashboardCard from "../../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchDashboardData } from "../../store/slices/dashboardSlice";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Use Redux state instead of useState
    const { stats, loading, error, lastUpdated } = useAppSelector(state => state.dashboard);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // ✅ Dispatch Redux action to fetch dashboard data
        dispatch(fetchDashboardData());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your library...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="alert alert-danger">
                        <h4>Error Loading Dashboard</h4>
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => dispatch(fetchDashboardData())}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8">
                <div className="flex">
                    <div className="flex-1 ml-8">
                        <h2 className="heading-2 mb-8 text-center text-gradient">
                            Library Dashboard
                        </h2>
                        
                        {/* Last Updated Info */}
                        {lastUpdated && (
                            <p className="text-center text-muted mb-4">
                                Last updated: {new Date(lastUpdated).toLocaleString()}
                            </p>
                        )}
                        
                        <div className="grid">
                            <DashboardCard
                                title="Total Books"
                                count={stats.totalBooks}
                                imageUrl="https://cdn-icons-png.flaticon.com/512/201/201818.png"
                                bgColor="linear-gradient(135deg, #4facfe, #00f2fe)"
                                onClick={() => navigate("/total-books-owned")}
                                url="/total-books-owned"
                            />
                            <DashboardCard
                                title="Borrowed Books"
                                count={stats.borrowedBooks}
                                imageUrl="https://cdn-icons-png.flaticon.com/512/1828/1828419.png"
                                bgColor="linear-gradient(135deg, #43e97b, #38f9d7)"
                                onClick={() => navigate("/total-books-borrowed")}
                                url="/total-books-borrowed"
                            />
                            <DashboardCard
                                title="Overdue Books"
                                count={stats.overdueBooks}
                                imageUrl="https://cdn-icons-png/flaticon.com/512/2910/2910768.png"
                                bgColor="linear-gradient(135deg, #ff758c, #ff7eb3)"
                                onClick={() => navigate("/total-books-overdue")}
                                url="/total-books-overdue"
                            />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="mt-8">
                            <h3 className="heading-3 mb-4">Recent Activity</h3>
                            
                            {/* Recent Books */}
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="heading-4 mb-3">Recent Books</h4>
                                    <div className="list-group">
                                        {stats.recentBooks.map((book) => (
                                            <div key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{book.title}</h6>
                                                    <small className="text-muted">{book.author}</small>
                                                </div>
                                                <span className={`badge ${book.status === 'available' ? 'bg-success' : 'bg-warning'}`}>
                                                    {book.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Recent Lending */}
                                <div className="col-md-6">
                                    <h4 className="heading-4 mb-3">Recent Lending</h4>
                                    <div className="list-group">
                                        {stats.recentLending.map((lending) => (
                                            <div key={lending.id} className="list-group-item">
                                                <h6 className="mb-1">{lending.bookTitle}</h6>
                                                <small className="text-muted">
                                                    Lent to: {lending.borrowerName}<br/>
                                                    Date: {new Date(lending.lendDate).toLocaleDateString()}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}