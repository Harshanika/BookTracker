import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="bg-white shadow-sm p-3 h-100" style={{ minWidth: 220 }}>
            <h5 className="mb-4 text-primary">Library Menu</h5>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/add-book">Add Book</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/lend-book">Lend A Book</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/lent-book-history">Lent Book History</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/return-book">Return A Book</Link>
                </li>
            </ul>
        </div>
    );
}