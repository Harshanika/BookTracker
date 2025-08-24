// src/components/Header.tsx
import React from "react";

interface HeaderProps {
    username: string;
    onLogout: () => void;
}

export default function Header({ username, onLogout }: HeaderProps) {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #dee2e6",
                marginBottom: "1rem",
            }}
        >
            <h1 style={{ margin: 0, color: "#007bff", fontSize: "1.5rem" }}>
                📚 Library Dashboard
            </h1>
            <div>
                <span
                    style={{
                        marginRight: "1rem",
                        fontWeight: "bold",
                        color: "#343a40",
                    }}
                >
                    Hello, {username}
                </span>
                <button
                    style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "#fff",
                        backgroundColor: "#dc3545",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                    }}
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}