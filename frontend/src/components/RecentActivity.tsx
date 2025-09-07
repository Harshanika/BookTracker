import React from 'react';
import { LoadingSpinner } from './SkeletonLoader';

interface RecentActivityProps {
  recentBooks: Array<{
    id: string;
    title: string;
    author: string;
    status: 'available' | 'borrowed';
    coverUrl?: string;
    addedDate?: string;
  }>;
  recentLending: Array<{
    id: string;
    bookTitle: string;
    borrowerName: string;
    borrower?: any;
    lendDate: string;
    expectedReturnDate?: string;
    actualReturnDate?: string;
    status: 'lent' | 'returned';
  }>;
  loading: boolean;
  error: string | null;
}

export default function RecentActivity({ 
  recentBooks, 
  recentLending, 
  loading, 
  error 
}: RecentActivityProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success';
      case 'borrowed':
        return 'bg-warning';
      case 'lent':
        return 'bg-info';
      case 'returned':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'borrowed':
        return 'Borrowed';
      case 'lent':
        return 'Lent Out';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  };

  // Safety check for undefined arrays
  const safeRecentBooks = recentBooks || [];
  const safeRecentLending = recentLending || [];

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="heading-3 mb-4">Recent Activity</h3>
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted mt-2">Loading recent activity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="heading-3 mb-4">Recent Activity</h3>
        <div className="alert alert-warning">
          <strong>Unable to load recent activity:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="heading-3 mb-4">Recent Activity</h3>
      
      <div className="row">
        {/* Recent Books */}
        <div className="col-md-6">
          <h4 className="heading-4 mb-3">
            📚 Recent Books Added
            {safeRecentBooks.length > 0 && (
              <span className="badge bg-primary ms-2">{safeRecentBooks.length}</span>
            )}
          </h4>
          
          {safeRecentBooks.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>No books added yet.</p>
              <small>Add your first book to see it here!</small>
            </div>
          ) : (
            <div className="list-group">
              {safeRecentBooks.map((book) => (
                <div key={book.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{book.title}</h6>
                      <small className="text-muted">{formatDate(book.addedDate)}</small>
                    </div>
                    <p className="mb-1 text-muted">{book.author}</p>
                    <span className={`badge ${getStatusColor(book.status)}`}>
                      {getStatusText(book.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Lending */}
        <div className="col-md-6">
          <h4 className="heading-4 mb-3">
            🤝 Recent Lending Activity
            {safeRecentLending.length > 0 && (
              <span className="badge bg-primary ms-2">{safeRecentLending.length}</span>
            )}
          </h4>
          
          {safeRecentLending.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>No lending activity yet.</p>
              <small>Lend a book to see activity here!</small>
            </div>
          ) : (
            <div className="list-group">
              {safeRecentLending.map((lending) => (
                <div key={lending.id} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{lending.bookTitle}</h6>
                    <small className="text-muted">{formatDate(lending.lendDate)}</small>
                  </div>
                  <p className="mb-1">
                    <strong>Borrower:</strong> {lending.borrowerName}
                    {lending.borrower && (
                      <span className="text-muted"> ({lending.borrower.email})</span>
                    )}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${getStatusColor(lending.status)}`}>
                      {getStatusText(lending.status)}
                    </span>
                    {lending.expectedReturnDate && (
                      <small className="text-muted">
                        Due: {new Date(lending.expectedReturnDate).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                  {lending.actualReturnDate && (
                    <small className="text-success mt-1">
                      Returned on: {formatDate(lending.actualReturnDate)}
                    </small>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
