import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    username: string;
    onLogout: () => void;
}

export default function Header({ username, onLogout }: HeaderProps) {
    return (
        <header className="bg-white shadow-soft border-b border-secondary-200">
            <div className="container">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">📚</div>
                        <h1 className="heading-4 text-gradient">SimpleLibrary</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-body text-gray-700">
                            Welcome, <span className="font-semibold text-primary-600">{username}</span>
                        </span>
                        <button
                            onClick={onLogout}
                            className="btn-outline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}