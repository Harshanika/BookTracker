import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "📊" },
        { label: "Add Book", path: "/add-book", icon: "📚" },
        { label: "Lend Book", path: "/lend-book", icon: "🤝" },
        { label: "Lending History", path: "/lent-book-history", icon: "📋" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 bg-white rounded-xl shadow-soft p-6">
            <h3 className="heading-4 mb-6 text-gray-900">Navigation</h3>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                            isActive(item.path)
                                ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                                : 'hover:bg-secondary-50 hover:text-primary-600'
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-body font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Quick Stats Section */}
            <div className="mt-8 pt-6 border-t border-secondary-200">
                <h4 className="text-label text-gray-600 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total Books:</span>
                        <span className="font-medium text-gray-900">42</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Borrowed:</span>
                        <span className="font-medium text-gray-900">7</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Overdue:</span>
                        <span className="font-medium text-warning-600">3</span>
                    </div>
                </div>
            </div>
        </div>
    );
}