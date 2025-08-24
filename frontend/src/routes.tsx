import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AddBook from "./features/books/AddBookForm";
import LendBook from "./features/books/LendBookForm";
import LendHistory from "./features/books/LentBooks";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-book"
                    element={
                        <ProtectedRoute>
                            <AddBook />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lend-book"
                    element={
                        <ProtectedRoute>
                            <LendBook />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lent-book-history"
                    element={
                        <ProtectedRoute>
                            <LendHistory />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}
