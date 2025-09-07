import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AddBook from "./features/books/AddBookForm";
import LendBook from "./features/books/LendBookForm";
import LendHistory from "./features/books/LentBooks";
import TotalBooks from "./pages/TotalBooks";
import BorrowedBooks from "./pages/BorrowedBooks";
import OverdueBooks from "./pages/OverdueBooks";
import LandingPage from "./features/landing/LandingPage";
import MainLayout from "./components/MainLayout";
import ErrorBoundary from "components/ErrorBoundry";
import ValidationTest from "./debug/ValidationTest";
import SimpleValidationTest from "./debug/SimpleValidationTest";
import LoaderTest from "./debug/LoaderTest";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/validation-test" element={<ValidationTest />} />
                <Route path="/simple-validation-test" element={<SimpleValidationTest />} />
                <Route path="/loader-test" element={<LoaderTest />} />

                {/* Protected routes with MainLayout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <Dashboard />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-book"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <AddBook />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lend-book"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <LendBook />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lent-book-history"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <LendHistory />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/total-books-owned"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <TotalBooks />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/total-books-borrowed"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <BorrowedBooks />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/total-books-overdue"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ErrorBoundary>
                                    <OverdueBooks />
                                </ErrorBoundary>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}