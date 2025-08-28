import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

interface OverdueBook {
    id: string;
    title: string;
    author: string;
    borrowerName: string;
    lendDate: string;
    expectedReturnDate: string;
    daysOverdue: number;
    coverUrl?: string;
}

export default function OverdueBooks() {
    const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOverdueBooks();
    }, []);

    const fetchOverdueBooks = async () => {
        try {
            // This would be your actual API endpoint for overdue books
            const response = await axios.get("http://localhost:4000/books/overdue", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setOverdueBooks(response.data.data || response.data);
            setLoading(false);
        } catch (err: any) {
            // Fallback to dummy data if API not ready
            const dummyData = [
                {
                    id: "1",
                    title: "The Great Gatsby",
                    author: "F. Scott Fitzgerald",
                    borrowerName: "John Doe",
                    lendDate: "2024-01-01",
                    expectedReturnDate: "2024-01-15",
                    daysOverdue: 15,
                    coverUrl: ""
                },
                {
                    id: "2",
                    title: "1984",
                    author: "George Orwell",
                    borrowerName: "Jane Smith",
                    lendDate: "2024-01-05",
                    expectedReturnDate: "2024-01-20",
                    daysOverdue: 10,
                    coverUrl: ""
                }
            ];
            setOverdueBooks(dummyData);
            setLoading(false);
        }
    };

    const filteredBooks = overdueBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const markAsReturned = async (bookId: string) => {
        try {
            await axios.put(`http://localhost:4000/books/${bookId}/return`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setOverdueBooks(prev => prev.filter(book => book.id !== bookId));
        } catch (err: any) {
            setError("Failed to mark book as returned");
        }
    };

    const sendReminder = async (bookId: string) => {
        try {
            await axios.post(`http://localhost:4000/books/${bookId}/reminder`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            // Show success message
        } catch (err: any) {
            setError("Failed to send reminder");
        }
    };

    const getOverdueSeverity = (daysOverdue: number) => {
        if (daysOverdue <= 7) return 'bg-warning';
        if (daysOverdue <= 30) return 'bg-danger';
        return 'bg-dark';
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading overdue books...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-danger mb-0">⚠️ Overdue Books ({overdueBooks.length})</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/lend-book'}>
                    + Lend New Book
                </button>
            </div>

            {/* Search Control */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <label className="form-label">Search Overdue Books</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title, author, or borrower..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            {/* Overdue Books List */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-success">
                        <h4>🎉 No overdue books!</h4>
                        <p>All your books are returned on time</p>
                    </div>
                </div>
            ) : (
                <div className="list-group">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="list-group-item list-group-item-action border-danger">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <BookCard 
                                        title={book.title} 
                                        author={book.author} 
                                        coverUrl={book.coverUrl}
                                        width={60}
                                        height={80}
                                    />
                                    <div className="ms-3">
                                        <h5 className="mb-1">{book.title}</h5>
                                        <p className="mb-1 text-muted">{book.author}</p>
                                        <div className="small text-muted">
                                            <span className="me-3">Borrowed by: <strong>{book.borrowerName}</strong></span>
                                            <span className="me-3">Lent on: {new Date(book.lendDate).toLocaleDateString()}</span>
                                            <span className="me-3">Expected return: {new Date(book.expectedReturnDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className={`badge ${getOverdueSeverity(book.daysOverdue)} text-white`}>
                                                {book.daysOverdue} days overdue
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => markAsReturned(book.id)}
                                    >
                                        Mark as Returned
                                    </button>
                                    <button 
                                        className="btn btn-warning btn-sm"
                                        onClick={() => sendReminder(book.id)}
                                    >
                                        Send Reminder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}