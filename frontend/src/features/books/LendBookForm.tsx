import React, { useEffect, useState } from "react";
import axios from "axios";

interface Book {
    id: string;
    title: string;
}

export default function LendBook() {
    const [books, setBooks] = useState<Book[]>([]);
    const [bookId, setBookId] = useState("");
    const [borrowerName, setBorrowerName] = useState("");
    const [lendDate, setLendDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch books owned by the user
    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await axios.get("http://localhost:4000/books", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setBooks(res.data);
            } catch (err: any) {
                setError("Failed to load books");
            }
        }
        fetchBooks();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/books/lend", {
                bookId,
                borrowerName,
                lendDate,
                returnDate: returnDate || null
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setSuccess("Book lent successfully!");
            setError("");
            setBookId("");
            setBorrowerName("");
            setLendDate("");
            setReturnDate("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to lend book");
            setSuccess("");
        }
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center text-primary mb-4">Lend a Book</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Select Book</label>
                        <select
                            className="form-select"
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Book --</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Borrower's Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={borrowerName}
                            onChange={(e) => setBorrowerName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Lend Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={lendDate}
                            onChange={(e) => setLendDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Expected Return Date (Optional)</label>
                        <input
                            type="date"
                            className="form-control"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Lend Book
                    </button>
                </form>
            </div>
        </div>
    );
}
