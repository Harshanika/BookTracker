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

    useEffect(() => {
        // Replace with real API calls
        setTotalBooks(42);
        setBorrowedBooks(7);
        setOverdueBooks(3);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8">
                <div className="flex">
                    <div className="flex-1 ml-8">
                        <h2 className="heading-2 mb-8 text-center text-gradient">
                            �� Library Dashboard
                        </h2>
                        <div className="grid">
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
                                imageUrl="https://cdn-icons-png/flaticon.com/512/2910/2910768.png"
                                bgColor="linear-gradient(135deg, #ff758c, #ff7eb3)"
                                onClick={() => navigate("/overdue")}
                                url="/overdue"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}