import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchLendingHistory, returnBook, clearError } from "../../store/slices/lendingSlice";
import BookCard from "../../components/BookCard";
import ReturnBookModal from "../../components/ReturnBookModal";

export default function LentBooks() {
    const dispatch = useAppDispatch();
    const { lendingRecords, loading, error } = useAppSelector(state => state.lending);
    const [returningId, setReturningId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchLendingHistory());
        dispatch(clearError());
    }, [dispatch]);

    const handleReturnClick = (record: any) => {
        setSelectedRecord(record);
        setShowReturnModal(true);
    };

    const handleReturnConfirm = async (actualReturnDate: string, returnNote: string) => {
        if (!selectedRecord) return;
        
        try {
            setReturningId(selectedRecord.id);
            await dispatch(returnBook({
                lendingId: selectedRecord.id.toString(),
                actualReturnDate,
                returnNote
            })).unwrap();
            setSuccessMessage("Book returned successfully!");
            // Refresh the lending history after successful return
            dispatch(fetchLendingHistory());
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000);
            // Close modal
            setShowReturnModal(false);
            setSelectedRecord(null);
        } catch (err: any) {
            console.error("Failed to mark book as returned:", err);
        } finally {
            setReturningId(null);
        }
    };

    const handleReturnCancel = () => {
        setShowReturnModal(false);
        setSelectedRecord(null);
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'lent':
                return 'bg-info text-white';
            case 'returned':
                return 'bg-success text-white';
            case 'overdue':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    const getOverdueSeverity = (daysOverdue: number) => {
        if (daysOverdue <= 7) return 'bg-warning text-dark';
        if (daysOverdue <= 30) return 'bg-danger text-white';
        return 'bg-dark text-white';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (expectedReturnDate: string | undefined, status: string | undefined) => {
        if (status === 'returned' || !expectedReturnDate) return false;
        return new Date(expectedReturnDate) < new Date();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading lending history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary mb-0">📚 Lending History ({lendingRecords.length})</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/lend-book'}>
                    + Lend New Book
                </button>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}
            {successMessage && <div className="alert alert-success mb-4">{successMessage}</div>}

            {lendingRecords.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <h4>📖 No Books Lent Yet</h4>
                        <p>You haven't lent any books yet. Start by lending a book to someone!</p>
                        <a href="/lend-book" className="btn btn-primary">
                            Lend a Book
                        </a>
                    </div>
                </div>
            ) : (
                <div className="list-group">
                    {lendingRecords.map((record) => {
                        // Safety check for record properties
                        if (!record || !record.book) {
                            return null;
                        }
                        
                        const isOverdueRecord = isOverdue(record.expectedReturnDate, record.status);
                        const currentStatus = isOverdueRecord ? 'overdue' : (record.status || 'lent');
                        const daysOverdue = isOverdueRecord ? Math.ceil((new Date().getTime() - new Date(record.expectedReturnDate!).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                        
                        return (
                            <div key={record.id} className={`list-group-item list-group-item-action ${currentStatus === 'overdue' ? 'border-danger' : ''}`}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <BookCard 
                                            title={record.book.title} 
                                            author={record.book.author} 
                                            width={60}
                                            height={80}
                                        />
                                        <div className="ms-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <h5 className="mb-0 me-2">{record.book.title}</h5>
                                                <span className={`badge ${getStatusColor(currentStatus)}`}>
                                                    {currentStatus?.toUpperCase() || 'UNKNOWN'}
                                                </span>
                                                {isOverdueRecord && (
                                                    <span className={`badge ${getOverdueSeverity(daysOverdue)} ms-2`}>
                                                        {daysOverdue} days overdue
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mb-1 text-muted">{record.book.author}</p>
                                            {record.book.genre && (
                                                <p className="mb-1 text-muted small">Genre: {record.book.genre}</p>
                                            )}
                                            <div className="small text-muted">
                                                <div className="mb-1">
                                                    <span className="me-3">Borrowed by: <strong className="text-primary">{record.borrowerName || 'Unknown'}</strong></span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="me-3">Lent on: {formatDate(record.lendDate)}</span>
                                                    {record.expectedReturnDate && (
                                                        <span className={`me-3 ${isOverdueRecord ? 'text-danger' : ''}`}>
                                                            Expected return: {formatDate(record.expectedReturnDate)}
                                                        </span>
                                                    )}
                                                </div>
                                                {record.actualReturnDate && (
                                                    <div className="mb-1">
                                                        <span className="me-3 text-success">
                                                            <strong>Returned on: {formatDate(record.actualReturnDate)}</strong>
                                                        </span>
                                                    </div>
                                                )}
                                                {record.returnNote && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">
                                                            <strong>Return Note:</strong> {record.returnNote}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {(record.status === 'lent' || !record.status) && (
                                        <div className="d-flex gap-2">
                                            {/* <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleReturnClick(record)}
                                                disabled={returningId === record.id}
                                            >
                                                {returningId === record.id ? "Returning..." : "Mark as Returned"}
                                            </button> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Return Book Modal */}
            <ReturnBookModal
                isOpen={showReturnModal}
                onClose={handleReturnCancel}
                onConfirm={handleReturnConfirm}
                bookTitle={selectedRecord?.book?.title || ''}
                borrowerName={selectedRecord?.borrowerName || ''}
                loading={returningId !== null}
            />
        </div>
    );
}