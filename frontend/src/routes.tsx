import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AddBook from "./features/books/AddBookForm";
import LendBook from "./features/books/LendBookForm";
import LendHistory from "./features/books/LentBooks";
import LandingPage from "features/landing/LandingPage";
import MainLayout from "components/MainLayout";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                             <MainLayout>
                                <Dashboard />
                             </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-book"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AddBook />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lend-book"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <LendBook />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lent-book-history"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <LendHistory />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}
