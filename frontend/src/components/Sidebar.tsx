import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "📊" },
        { label: "Add Book", path: "/add-book", icon: "📚" },
        { label: "Lend Book", path: "/lend-book", icon: "🤝" },
        { label: "Lending History", path: "/lent-book-history", icon: "📋" },
    ];

    return (
        <div className="w-64 bg-white rounded-xl shadow-soft p-6">
            <h3 className="heading-4 mb-6 text-gray-900">Navigation</h3>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="w-full text-left p-3 rounded-lg hover:bg-secondary-50 hover:text-primary-600 transition-all duration-200 flex items-center space-x-3"
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-body font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}