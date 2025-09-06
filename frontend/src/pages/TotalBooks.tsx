import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserOwnedBooks } from "../store/slices/dashboardSlice";
// @ts-ignore
import BookCard from "../components/BookCard";

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: 'available' | 'borrowed';
    coverUrl?: string;
}

export default function TotalBooks() {
    const dispatch = useAppDispatch();
    const { ownedBooks, loading, error } = useAppSelector(state => state.dashboard);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGenre, setFilterGenre] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(12);

    useEffect(() => {
        dispatch(getUserOwnedBooks({ page: currentPage, limit: booksPerPage }));
    }, [dispatch, currentPage, booksPerPage]);

    const filteredBooks = ownedBooks.books?.filter((book: any) => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = filterGenre === "" || book.genre === filterGenre;
        const matchesStatus = filterStatus === "" || book.status === filterStatus;
        return matchesSearch && matchesGenre && matchesStatus;
    }) || [];

    const genres = Array.from(new Set(ownedBooks.books?.map((book: any) => book.genre) || []));

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your library...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary mb-0">📚 Total Books ({ownedBooks.total || 0})</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/add-book'}>
                    + Add New Book
                </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label">Search Books</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Filter by Genre</label>
                            <select
                                className="form-select"
                                value={filterGenre}
                                onChange={(e) => setFilterGenre(e.target.value)}
                            >
                                <option value="">All Genres</option>
                            {genres.map((genre: any) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Filter by Status</label>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="borrowed">Borrowed</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterGenre("");
                                    setFilterStatus("");
                                }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <h4>No books found</h4>
                        <p>Try adjusting your search or filters</p>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {filteredBooks.map((book: any) => (
                        <div key={book.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <BookCard 
                                            title={book.title} 
                                            author={book.author} 
                                            coverUrl={book.coverUrl}
                                            width={60}
                                            height={80}
                                        />
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="card-title mb-1">{book.title}</h5>
                                            <p className="card-text text-muted mb-2">{book.author}</p>
                                            <span className="badge bg-secondary me-2">{book.genre}</span>
                                            <span className={`badge ${book.status === 'available' ? 'bg-success' : 'bg-warning'}`}>
                                                {book.status === 'available' ? 'Available' : 'Borrowed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-primary btn-sm flex-fill">
                                            Edit
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm flex-fill">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {ownedBooks.totalPages > 1 && (
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
                            
                            {Array.from({ length: ownedBooks.totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === ownedBooks.totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === ownedBooks.totalPages}
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
                Showing {((currentPage - 1) * booksPerPage) + 1} to {Math.min(currentPage * booksPerPage, ownedBooks.total || 0)} of {ownedBooks.total || 0} books
            </div>
        </div>
    );
}