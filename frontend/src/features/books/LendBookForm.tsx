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
        <div>
            <h2 className="heading-2 mb-8 text-center text-gradient">
                🤝 Lend a Book
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
                        <label className="text-label block mb-2">Select Book</label>
                        <select
                            className="input-field"
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

                    <div>
                        <label className="text-label block mb-2">Borrower's Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={borrowerName}
                            onChange={(e) => setBorrowerName(e.target.value)}
                            placeholder="Enter borrower's name"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Lend Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={lendDate}
                            onChange={(e) => setLendDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Expected Return Date (Optional)</label>
                        <input
                            type="date"
                            className="input-field"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full">
                        Lend Book
                    </button>
                </form>
            </div>
        </div>
    );
}