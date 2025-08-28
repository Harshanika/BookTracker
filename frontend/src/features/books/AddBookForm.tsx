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
        <div>
            <h2 className="heading-2 mb-8 text-center text-gradient">
                📚 Add New Book
            </h2>
            <div className="card max-w-2xl mx-auto">
                {error && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-600">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg text-success-600">
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-label block mb-2">Book Title</label>
                        <input
                            type="text"
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Author</label>
                        <input
                            type="text"
                            className="input-field"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Genre</label>
                        <input
                            type="text"
                            className="input-field"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="Enter genre"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Status</label>
                        <select
                            className="input-field"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="btn-primary flex-1">
                            Add Book
                        </button>
                        <button 
                            type="button" 
                            className="btn-secondary flex-1"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}