// src/pages/AddBook.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../../services/bookService";

export default function AddBook() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState("available");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await bookService.addBook({ title, author, genre, status });
            setSuccess("Book added successfully!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err: any) {
            setError(err.message || "Failed to add book");
        }
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Add New Book</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Genre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="borrowed">Borrowed</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Add Book
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
