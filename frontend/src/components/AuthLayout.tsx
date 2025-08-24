import React from "react";

export default function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="text-center text-primary mb-4">{title}</h1>
                {children}
            </div>
        </div>
    );
}
