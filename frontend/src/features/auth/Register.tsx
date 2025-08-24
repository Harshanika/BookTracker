import React, { useState } from "react";
import { registerUser } from "../../services/auth";
import type { RegisterResponse } from "./types";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Inside your Register component
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await registerUser({ fullname: name, email, password }) as RegisterResponse;
            setSuccess("Registration successful! You can now log in.");
            setError("");
            setName("");
            setEmail("");
            setPassword("");
            setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
        } catch (err: any) {
            setError(err.message);
            setSuccess("");
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="text-center text-primary mb-4">Register</h1>

                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            id="name"
                            className="form-control"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            className="form-control"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-success w-100" type="submit">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
