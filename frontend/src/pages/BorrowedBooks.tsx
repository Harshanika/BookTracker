import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getBorrowedBooks } from "../store/slices/dashboardSlice";
import BookCard from "../components/BookCard";

interface BorrowedBook {
    id: string;
    title: string;
    author: string;
    borrowerName: string;
    lendDate: string;
    expectedReturnDate?: string;
    coverUrl?: string;
}

export default function BorrowedBooks() {
    const dispatch = useAppDispatch();
    const { borrowedBooks, loading, error } = useAppSelector(state => state.dashboard);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);

    useEffect(() => {
        dispatch(getBorrowedBooks({ page: currentPage, limit: booksPerPage }));
    }, [dispatch, currentPage, booksPerPage]);

    const filteredBooks = borrowedBooks.books?.filter((book: any) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const markAsReturned = async (bookId: string) => {
        try {
            // TODO: Implement return book action in Redux
            // For now, just refresh the data
            dispatch(getBorrowedBooks({ page: currentPage, limit: booksPerPage }));
        } catch (err: any) {
            console.error("Failed to mark book as returned:", err);
        }
    };

    const isOverdue = (expectedDate: string) => {
        return new Date(expectedDate) < new Date();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading borrowed books...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary mb-0">🤝 Borrowed Books ({borrowedBooks.total || 0})</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/lend-book'}>
                    + Lend New Book
                </button>
            </div>

            {/* Search Control */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <label className="form-label">Search Borrowed Books</label>
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

            {/* Borrowed Books List */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <h4>No borrowed books found</h4>
                        <p>All your books are available in your library</p>
                    </div>
                </div>
            ) : (
                <div className="list-group">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="list-group-item list-group-item-action">
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
                                            {book.expectedReturnDate && (
                                                <span className={`me-3 ${isOverdue(book.expectedReturnDate) ? 'text-danger' : ''}`}>
                                                    Expected return: {new Date(book.expectedReturnDate).toLocaleDateString()}
                                                    {isOverdue(book.expectedReturnDate) && ' (OVERDUE)'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() => markAsReturned(book.id)}
                                    >
                                        Mark as Returned
                                    </button>
                                    <button className="btn btn-outline-primary btn-sm">
                                        Send Reminder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {borrowedBooks.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            
                            {Array.from({ length: borrowedBooks.totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === borrowedBooks.totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === borrowedBooks.totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-3 text-muted">
                Showing {((currentPage - 1) * booksPerPage) + 1} to {Math.min(currentPage * booksPerPage, borrowedBooks.total || 0)} of {borrowedBooks.total || 0} borrowed books
            </div>
        </div>
    );
}