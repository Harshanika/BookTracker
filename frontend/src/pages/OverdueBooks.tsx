import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getOverdueBooks } from "../store/slices/dashboardSlice";
import { returnBook } from "../store/slices/lendingSlice";
import BookCard from "../components/BookCard";
import ReturnBookModal from "../components/ReturnBookModal";

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
    const dispatch = useAppDispatch();
    const { overdueBooks, loading, error } = useAppSelector(state => state.dashboard);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [returningBook, setReturningBook] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<any>(null);

    useEffect(() => {
        dispatch(getOverdueBooks({ page: currentPage, limit: booksPerPage }));
    }, [dispatch, currentPage, booksPerPage]);

    const filteredBooks = overdueBooks.lendingRecords?.filter((record: any) => {
        const book = record.book;
        return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
               record.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

    const handleReturnClick = (record: any) => {
        setSelectedBook(record);
        setShowReturnModal(true);
    };

    const handleReturnConfirm = async (actualReturnDate: string, returnNote: string) => {
        if (!selectedBook) return;
        
        try {
            setReturningBook(selectedBook.id);
            await dispatch(returnBook({
                lendingId: selectedBook.id,
                actualReturnDate,
                returnNote
            })).unwrap();
            setSuccessMessage("Book returned successfully!");
            // Refresh the overdue books list after successful return
            dispatch(getOverdueBooks({ page: currentPage, limit: booksPerPage }));
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000);
            // Close modal
            setShowReturnModal(false);
            setSelectedBook(null);
        } catch (err: any) {
            console.error("Failed to mark book as returned:", err);
        } finally {
            setReturningBook(null);
        }
    };

    const handleReturnCancel = () => {
        setShowReturnModal(false);
        setSelectedBook(null);
    };

    const sendReminder = async (bookId: string) => {
        try {
            // TODO: Implement send reminder action in Redux
            // For now, just show a success message
            alert("Reminder sent successfully!");
        } catch (err: any) {
            console.error("Failed to send reminder:", err);
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
                <h2 className="text-danger mb-0">⚠️ Overdue Books ({overdueBooks.total || 0})</h2>
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
            {successMessage && <div className="alert alert-success mb-4">{successMessage}</div>}

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
                    {filteredBooks.map((record: any) => {
                        const book = record.book;
                        const daysOverdue = Math.ceil((new Date().getTime() - new Date(record.expectedReturnDate).getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                            <div key={record.id} className="list-group-item list-group-item-action border-danger">
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
                                            <div className="d-flex align-items-center mb-1">
                                                <h5 className="mb-0 me-2">{book.title}</h5>
                                                <span className="badge bg-danger text-white">Overdue</span>
                                            </div>
                                            <p className="mb-1 text-muted">{book.author}</p>
                                            <div className="small text-muted">
                                                <div className="mb-1">
                                                    <span className="me-3">Borrowed by: <strong className="text-danger">{record.borrowerName}</strong></span>
                                                    {record.borrower?.email && (
                                                        <span className="text-muted">({record.borrower.email})</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="me-3">Lent on: {new Date(record.lendDate).toLocaleDateString()}</span>
                                                    <span className="me-3">Expected return: {new Date(record.expectedReturnDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className={`badge ${getOverdueSeverity(daysOverdue)} text-white`}>
                                                    {daysOverdue} days overdue
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleReturnClick(record)}
                                            disabled={returningBook === record.id}
                                        >
                                            {returningBook === record.id ? "Returning..." : "Mark as Returned"}
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
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {overdueBooks.totalPages > 1 && (
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
                            
                            {Array.from({ length: overdueBooks.totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === overdueBooks.totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === overdueBooks.totalPages}
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
                Showing {((currentPage - 1) * booksPerPage) + 1} to {Math.min(currentPage * booksPerPage, overdueBooks.total || 0)} of {overdueBooks.total || 0} overdue books
            </div>

            {/* Return Book Modal */}
            <ReturnBookModal
                isOpen={showReturnModal}
                onClose={handleReturnCancel}
                onConfirm={handleReturnConfirm}
                bookTitle={selectedBook?.book?.title || ''}
                borrowerName={selectedBook?.borrowerName || ''}
                loading={returningBook !== null}
            />
        </div>
    );
}