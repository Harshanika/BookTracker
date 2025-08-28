import React from 'react';

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export default function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
    return (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <span className="me-2">⚠️</span>
                <span>{error}</span>
            </div>
            <div className="d-flex gap-2">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn btn-outline-danger btn-sm"
                    >
                        Retry
                    </button>
                )}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        Dismiss
                    </button>
                )}
            </div>
        </div>
    );
}