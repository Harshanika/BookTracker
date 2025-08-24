// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import type { User } from "../auth/types";
import { getMe } from "../../services/auth";
import {userOwned} from "../../api/dashboardApi";

export default function Dashboard() {
    const [totalBooks, setTotalBooks] = useState(0);
    const [borrowedBooks, setBorrowedBooks] = useState(0);
    const [overdueBooks, setOverdueBooks] = useState(0);
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null); // Add user state

    useEffect(() => {

        // Fetch user info after login
        const fetchUser = async () => {
            try {
                const userData = await getMe() as User;
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user", error);
                navigate("/login");
            }
        };
        fetchUser();

            // Replace with real API calls
        setTotalBooks(42);
        setBorrowedBooks(7);
        setOverdueBooks(3);
    }, []);

    const handleLogout = () => {
        // Clear user session, then redirect to login
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <div>
            <Header username={user?.name as string} onLogout={handleLogout} />
                <div className="container my-5">
                    <Sidebar />
                    <h2 className="mb-4 text-center fw-bold text-primary">
                        📚 Library Dashboard
                    </h2>
                    <div className="row">
                        <DashboardCard
                            title="Total Books"
                            count={totalBooks}
                            imageUrl="https://cdn-icons-png.flaticon.com/512/201/201818.png"
                            bgColor="linear-gradient(135deg, #4facfe, #00f2fe)"
                            onClick={() => navigate("/owned")}
                            url="/owned"
                        />
                        <DashboardCard
                            title="Borrowed Books"
                            count={borrowedBooks}
                            imageUrl="https://cdn-icons-png.flaticon.com/512/1828/1828419.png"
                            bgColor="linear-gradient(135deg, #43e97b, #38f9d7)"
                            onClick={() => navigate("/borrowed")}
                            url="/borrowed"
                        />
                        <DashboardCard
                            title="Overdue Books"
                            count={overdueBooks}
                            imageUrl="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
                            bgColor="linear-gradient(135deg, #ff758c, #ff7eb3)"
                            onClick={() => navigate("/overdue")}
                            url="/overdue"
                        />
                    </div>
                </div>
        </div>
    );
}
