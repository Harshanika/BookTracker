import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGenre, setFilterGenre] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get("http://localhost:4000/books", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setBooks(response.data.data || response.data);
            setLoading(false);
        } catch (err: any) {
            setError("Failed to load books");
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = filterGenre === "" || book.genre === filterGenre;
        return matchesSearch && matchesGenre;
    });

    const genres = Array.from(new Set(books.map(book => book.genre)));

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
                <h2 className="text-primary mb-0">📚 Total Books ({books.length})</h2>
                <button className="btn btn-primary" onClick={() => window.location.href = '/add-book'}>
                    + Add New Book
                </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Search Books</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Filter by Genre</label>
                            <select
                                className="form-select"
                                value={filterGenre}
                                onChange={(e) => setFilterGenre(e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
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
                    {filteredBooks.map((book) => (
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
        </div>
    );
}