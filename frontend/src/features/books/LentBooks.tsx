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
            case 'returned_on_time':
                return 'bg-success text-white';
            case 'returned_early':
                return 'bg-success text-white';
            case 'returned_late':
                return 'bg-warning text-dark';
            case 'overdue':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'lent':
                return 'LENT';
            case 'returned':
                return 'RETURNED';
            case 'returned_on_time':
                return 'RETURNED ON TIME';
            case 'returned_early':
                return 'RETURNED EARLY';
            case 'returned_late':
                return 'RETURNED LATE';
            case 'overdue':
                return 'OVERDUE';
            default:
                return 'UNKNOWN';
        }
    };

    const getOverdueSeverity = (daysOverdue: number) => {
        if (daysOverdue <= 7) return 'bg-warning text-dark';
        if (daysOverdue <= 30) return 'bg-danger text-white';
        return 'bg-dark text-white';
    };

    const getReturnTimingInfo = (record: any) => {
        if (!record.actualReturnDate || !record.expectedReturnDate) return null;
        
        const actualDate = new Date(record.actualReturnDate);
        const expectedDate = new Date(record.expectedReturnDate);
        const diffDays = Math.ceil((actualDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return ' (on time)';
        if (diffDays < 0) return ` (${Math.abs(diffDays)} days early)`;
        return ` (${diffDays} days late)`;
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
                    {lendingRecords.map((bookGroup: any) => {
                        // Safety check for book group properties
                        if (!bookGroup || !bookGroup.book) {
                            return null;
                        }
                        
                        const { book, lendingHistory, totalLendings, currentStatus } = bookGroup;
                        // Get the most recent record (last in the chronologically sorted array)
                        const latestRecord = lendingHistory[lendingHistory.length - 1];
                        const isOverdueRecord = isOverdue(latestRecord?.expectedReturnDate, latestRecord?.status);
                        const finalStatus = isOverdueRecord ? 'overdue' : (currentStatus || 'available');
                        const daysOverdue = isOverdueRecord ? Math.ceil((new Date().getTime() - new Date(latestRecord.expectedReturnDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                        
                        return (
                            <div key={book.id} className={`list-group-item list-group-item-action ${finalStatus === 'overdue' ? 'border-danger' : ''}`}>
                                <div className="d-flex align-items-start justify-content-between">
                                    <div className="d-flex align-items-start">
                                        <BookCard 
                                            title={book.title} 
                                            author={book.author} 
                                            width={60}
                                            height={80}
                                        />
                                        <div className="ms-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <h5 className="mb-0 me-2">{book.title}</h5>
                                                <span className={`badge ${getStatusColor(finalStatus)}`}>
                                                    {getStatusText(finalStatus)}
                                                </span>
                                                {isOverdueRecord && (
                                                    <span className={`badge ${getOverdueSeverity(daysOverdue)} ms-2`}>
                                                        {daysOverdue} days overdue
                                                    </span>
                                                )}
                                                <span className="badge bg-secondary ms-2">
                                                    {totalLendings} lending{totalLendings !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <p className="mb-1 text-muted">{book.author}</p>
                                            {book.genre && (
                                                <p className="mb-1 text-muted small">Genre: {book.genre}</p>
                                            )}
                                            
                                            {/* Current Status */}
                                            {latestRecord && (
                                                <div className="small text-muted mb-2">
                                                    <div className="mb-1">
                                                        <span className="me-3">Current borrower: <strong className="text-primary">{latestRecord.borrowerName || 'Unknown'}</strong></span>
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="me-3">Lent on: {formatDate(latestRecord.lendDate)}</span>
                                                        {latestRecord.expectedReturnDate && (
                                                            <span className={`me-3 ${isOverdueRecord ? 'text-danger' : ''}`}>
                                                                Expected return: {formatDate(latestRecord.expectedReturnDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {latestRecord.actualReturnDate && (
                                                        <div className="mb-1">
                                                            <span className="me-3 text-success">
                                                                <strong>Returned on: {formatDate(latestRecord.actualReturnDate)}</strong>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {latestRecord.returnNote && (
                                                        <div className="mt-2">
                                                            <small className="text-muted">
                                                                <strong>Return Note:</strong> {latestRecord.returnNote}
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Lending History */}
                                            {lendingHistory.length > 1 && (
                                                <div className="mt-3">
                                                    <h6 className="text-muted mb-2">📚 Lending History:</h6>
                                                    <div className="small">
                                                        {lendingHistory.slice(0, -1).map((record: any, index: number) => (
                                                            <div key={record.id} className="mb-1 p-2 bg-light rounded">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <strong>{record.borrowerName || 'Unknown'}</strong>
                                                                        <span className="text-muted ms-2">
                                                                            {formatDate(record.lendDate)} - {record.actualReturnDate ? formatDate(record.actualReturnDate) : 'Current'}
                                                                            {getReturnTimingInfo(record)}
                                                                        </span>
                                                                    </div>
                                                                    <span className={`badge ${getStatusColor(record.status)}`}>
                                                                        {getStatusText(record.status)}
                                                                    </span>
                                                                </div>
                                                                {record.returnNote && (
                                                                    <div className="mt-1">
                                                                        <small className="text-muted">
                                                                            <strong>Note:</strong> {record.returnNote}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {(finalStatus === 'lent' || finalStatus === 'overdue') && latestRecord && (
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleReturnClick(latestRecord)}
                                                disabled={returningId === latestRecord.id}
                                            >
                                                {returningId === latestRecord.id ? "Returning..." : "Mark as Returned"}
                                            </button>
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