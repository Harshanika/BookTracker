import React, { useEffect } from "react";
import DashboardCard from "../../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchBooks, setStats } from "../../store/slices/bookSlice";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Use Redux state instead of useState
    const { books, loading, totalBooks, borrowedBooks, overdueBooks } = useAppSelector(state => state.books);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // ✅ Dispatch Redux action to fetch books
        dispatch(fetchBooks());
    }, [dispatch]);

    useEffect(() => {
        // ✅ Calculate stats from Redux state
        if (books.length > 0) {
            const borrowed = books.filter(book => book.status === 'borrowed').length;
            const overdue = books.filter(book => {
                // Add your overdue logic here
                return false; // Placeholder
            }).length;
            
            dispatch(setStats({ total: books.length, borrowed, overdue }));
        }
    }, [books, dispatch]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8">
                <div className="flex">
                    <div className="flex-1 ml-8">
                        <h2 className="heading-2 mb-8 text-center text-gradient">
                            Library Dashboard
                        </h2>
                        <div className="grid">
                            <DashboardCard
                                title="Total Books"
                                count={totalBooks}
                                imageUrl="https://cdn-icons-png.flaticon.com/512/201/201818.png"
                                bgColor="linear-gradient(135deg, #4facfe, #00f2fe)"
                                onClick={() => navigate("/total-books-owned")}
                                url="/total-books-owned"
                            />
                            <DashboardCard
                                title="Borrowed Books"
                                count={borrowedBooks}
                                imageUrl="https://cdn-icons-png/flaticon.com/512/1828/1828419.png"
                                bgColor="linear-gradient(135deg, #43e97b, #38f9d7)"
                                onClick={() => navigate("/total-books-borrowed")}
                                url="/total-books-borrowed"
                            />
                            <DashboardCard
                                title="Overdue Books"
                                count={overdueBooks}
                                imageUrl="https://cdn-icons-png/flaticon.com/512/2910/2910768.png"
                                bgColor="linear-gradient(135deg, #ff758c, #ff7eb3)"
                                onClick={() => navigate("/total-books-overdue")}
                                url="/total-books-overdue"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}