import React from "react";
import BookCard from "../../components/BookCard";
import { LentBook } from "./types";



const dummyLentBooks: LentBook[] = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        coverUrl: "https://covers.openlibrary.org/b/id/10338818-L.jpg",
        lentDate: "2025-08-01",
        returnDate: "2025-08-20"
    },
    {
        id: 2,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        coverUrl: "https://covers.openlibrary.org/b/id/10594690-L.jpg",
        lentDate: "2025-07-15",
        returnDate: "2025-08-20"
    }
];

export default function LendHistory() {
    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-primary">Lent Books</h2>
            <div className="list-group">
                {dummyLentBooks.map((book) => (
                    <div key={book.id} className="list-group-item list-group-item-action d-flex align-items-center">
                    <BookCard title={book.title} author={book.author} coverUrl={book.coverUrl} />
                    <div className="flex-grow-1">
                        <h5 className="mb-1">{book.title}</h5>
                            <p className="mb-1 text-muted">{book.author}</p>
                            <small>
                                Lent on: {book.lentDate}{" "}
                                {book.returnDate ? `| Returned on: ${book.returnDate}` : "| Not Returned Yet"}
                            </small>
                    </div>
                <button className="btn btn-outline-success btn-sm ms-3">Mark as Returned</button>
            </div>
                ))}
            </div>
        </div>
    );
}
