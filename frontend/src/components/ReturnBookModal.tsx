import React, { useState, useEffect } from 'react';

interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actualReturnDate: string, returnNote: string) => void;
  bookTitle: string;
  borrowerName: string;
  loading?: boolean;
}

export default function ReturnBookModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  borrowerName,
  loading = false
}: ReturnBookModalProps) {
  const [actualReturnDate, setActualReturnDate] = useState('');
  const [returnNote, setReturnNote] = useState('');

  // Set default return date to today when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setActualReturnDate(today);
      setReturnNote('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actualReturnDate) {
      onConfirm(actualReturnDate, returnNote);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📚 Mark Book as Returned</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <h6 className="text-primary">Book Details</h6>
                <p className="mb-1"><strong>Title:</strong> {bookTitle}</p>
                <p className="mb-0"><strong>Borrowed by:</strong> {borrowerName}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">
                  <strong>Actual Return Date</strong> <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={actualReturnDate}
                  onChange={(e) => setActualReturnDate(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="form-text">
                  Select the actual date when the book was returned
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <strong>Return Note</strong> <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Add any notes about the return (e.g., condition, late return reason, etc.)"
                  disabled={loading}
                />
                <div className="form-text">
                  Add any additional information about the book return
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || !actualReturnDate}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Marking as Returned...
                  </>
                ) : (
                  'Mark as Returned'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
