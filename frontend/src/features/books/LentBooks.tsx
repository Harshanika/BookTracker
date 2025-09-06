import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchLendingHistory, returnBook, clearError } from "../../store/slices/lendingSlice";

export default function LentBooks() {
    const dispatch = useAppDispatch();
    const { lendingRecords, loading, error } = useAppSelector(state => state.lending);
    const [returningId, setReturningId] = useState<number | null>(null);

    useEffect(() => {
        // dispatch(fetchLendingHistory());
        dispatch(clearError());
    }, [dispatch]);

    const handleReturnBook = async (lendingId: number) => {
        setReturningId(lendingId);
        try {
            await dispatch(returnBook(lendingId.toString())).unwrap();
            // Refresh the lending history after returning
            // dispatch(fetchLendingHistory());
        } catch (error) {
            console.error("Failed to return book:", error);
        } finally {
            setReturningId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'lent':
                return 'bg-blue-100 text-blue-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (expectedReturnDate: string | undefined, status: string) => {
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
        <div>
            <h2 className="heading-2 mb-8 text-center text-gradient">
                📚 Lending History
            </h2>

            {error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-600">
                    {error}
                </div>
            )}

            {lendingRecords.length === 0 ? (
                <div className="card max-w-2xl mx-auto text-center py-12">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="heading-3 mb-2 text-gray-700">No Books Lent Yet</h3>
                    <p className="text-gray-600 mb-6">
                        You haven't lent any books yet. Start by lending a book to someone!
                    </p>
                    <a href="/lend-book" className="btn-primary">
                        Lend a Book
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {lendingRecords.map((record) => {
                        const isOverdueRecord = isOverdue(record.expectedReturnDate, record.status);
                        const currentStatus = isOverdueRecord ? 'overdue' : record.status;
                        
                        return (
                            <div key={record.id} className="card">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="heading-4 text-gray-900">
                                                {record.book.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
                                                {currentStatus.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-2">
                                            by <span className="font-medium">{record.book.author}</span>
                                            {record.book.genre && (
                                                <span className="ml-2 text-sm text-gray-500">
                                                    • {record.book.genre}
                                                </span>
                                            )}
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Borrower:</span>
                                                <span className="ml-2 font-medium">
                                                    {record.borrowerName || 'Unknown'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Lent on:</span>
                                                <span className="ml-2 font-medium">
                                                    {formatDate(record.lendDate)}
                                                </span>
                                            </div>
                                            {record.expectedReturnDate && (
                                                <div>
                                                    <span className="text-gray-500">Expected return:</span>
                                                    <span className={`ml-2 font-medium ${isOverdueRecord ? 'text-red-600' : ''}`}>
                                                        {formatDate(record.expectedReturnDate)}
                                                    </span>
                                                </div>
                                            )}
                                            {record.actualReturnDate && (
                                                <div>
                                                    <span className="text-gray-500">Returned on:</span>
                                                    <span className="ml-2 font-medium text-green-600">
                                                        {formatDate(record.actualReturnDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {record.status === 'lent' && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleReturnBook(record.id)}
                                                disabled={returningId === record.id}
                                                className="btn-outline text-sm"
                                            >
                                                {returningId === record.id ? 'Returning...' : 'Mark as Returned'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}