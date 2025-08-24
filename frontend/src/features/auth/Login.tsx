import React, { useState } from "react";
import { loginUser } from "../../services/auth";
import type { LoginResponse, User } from "./types";
import { extractErrorMessage } from "../../utils/errorHandler";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await loginUser({email, password}) as LoginResponse;
            localStorage.setItem("token", res.access_token);

            window.location.href = "/dashboard";
        } catch (err: any) {
            const errorMsg = extractErrorMessage(err);
            setError(errorMsg);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="text-center text-primary mb-4">Login</h1>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
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

                    <button className="btn btn-primary w-100" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
