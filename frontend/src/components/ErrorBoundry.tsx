import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-soft p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="heading-3 text-gray-900 mb-4">Something went wrong</h1>
                        <p className="text-body text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary w-full"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="btn-secondary w-full"
                            >
                                Go to Dashboard
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Error Details (Development)
                                </summary>
                                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 overflow-auto">
                                    <div className="mb-2">
                                        <strong>Error:</strong> {this.state.error.toString()}
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <strong>Component Stack:</strong>
                                            <pre className="whitespace-pre-wrap mt-1">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}