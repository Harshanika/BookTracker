// src/components/DashboardCard.tsx
import React from "react";

interface DashboardCardProps {
    title: string;
    count: number;
    imageUrl: string;
    bgColor: string; // <-- Add this line
    onClick: () => void;
    url?: string; // Optional URL for additional functionality
}

export default function DashboardCard({
                                          title,
                                          count,
                                          imageUrl,
                                          bgColor,
                                          onClick,
                                          url
                                      }: DashboardCardProps) {
    return (
        <div className="col-md-4 mb-4" onClick={onClick} style={{ cursor: "pointer" }}>
            <div
                className="card shadow-lg border-0 h-100 text-white"
                style={{ background: bgColor, borderRadius: "20px" }}
            >
                <div className="card-body text-center p-4">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="mb-3"
                        style={{ height: "80px" }}
                    />
                    <h5 className="fw-bold">{title}</h5>
                    <p className="display-5 fw-bold">{count}</p>
                </div>
            </div>
        </div>
    );
}
