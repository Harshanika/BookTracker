import React, { useEffect } from "react";
import DashboardCard from "../../components/DashboardCard";
import RecentActivity from "../../components/RecentActivity";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchDashboardData, fetchRecentActivity } from "../../store/slices/dashboardSlice";
//  import { fetchAllBooks, fetchUserBooks } from "store/slices/bookSlice";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Use Redux state instead of useState
    // const { stats, loading, error, lastUpdated } = useAppSelector(state => state.dashboard);
    // const { user } = useAppSelector(state => state.auth);
    // const { books, userBooks, loading: booksLoading, error: booksError } = useAppSelector(state => state.book);
    const { stats, loading: dashboardLoading, error: dashboardError } = useAppSelector(state => state.dashboard);
    
    useEffect(() => {
        // ✅ Dispatch Redux action to fetch dashboard data
        dispatch(fetchDashboardData());
        // ✅ Fetch recent activity
        dispatch(fetchRecentActivity(10));
        // dispatch(fetchUserBooks());
        // dispatch(fetchAllBooks());
    }, [dispatch]);

    // const totalBooks = userBooks.length ? userBooks.length : 0;
    // const borrowedBooks = userBooks.filter(book => book.status === 'borrowed').length;
    // const availableBooks = userBooks.filter(book => book.status === 'available').length ? userBooks.filter(book => book.status === 'available').length : 0;

    if (dashboardLoading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (dashboardError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="alert alert-danger">
                        <h4>Error Loading Dashboard</h4>
                        <p>{dashboardError}</p>
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
                        {/* {stats.lastUpdated && (
                            <p className="text-center text-muted mb-4">
                                Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                            </p>
                        )} */}
                        
                        <div className="grid">
                            <DashboardCard
                                title="Total Books"
                                count={stats?.totalBooks || 0}
                                imageUrl="https://cdn-icons-png.flaticon.com/512/201/201818.png"
                                bgColor="linear-gradient(135deg, #4facfe, #00f2fe)"
                                onClick={() => navigate("/total-books-owned")}
                                url="/total-books-owned"
                            />
                            <DashboardCard
                                title="Borrowed Books"
                                count={stats?.borrowedBooks || 0}
                                imageUrl="https://cdn-icons-png.flaticon.com/512/1828/1828419.png"
                                bgColor="linear-gradient(135deg, #43e97b, #38f9d7)"
                                onClick={() => navigate("/total-books-borrowed")}
                                url="/total-books-borrowed"
                            />
                            <DashboardCard
                                title="Overdue Books"
                                count={stats?.overdueBooks || 0}
                                imageUrl="https://cdn-icons-png/flaticon.com/512/2910/2910768.png"
                                bgColor="linear-gradient(135deg, #ff758c, #ff7eb3)"
                                onClick={() => navigate("/total-books-overdue")}
                                url="/total-books-overdue"
                            />
                        </div>

                        {/* Recent Activity Section */}
                        <RecentActivity 
                            recentBooks={stats?.recentBooks || []}
                            recentLending={stats?.recentLending || []}
                            loading={dashboardLoading}
                            error={dashboardError}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}