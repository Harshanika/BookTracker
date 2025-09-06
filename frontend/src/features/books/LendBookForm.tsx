import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUserAvailableBooks, fetchUserBooks } from "../../store/slices/bookSlice";
import { lendBook, clearError } from "../../store/slices/lendingSlice";
import { fetchAllUsers, clearUsers } from "../../store/slices/userSlice";

export default function LendBook() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Redux state
    const { userBooks, loading: booksLoading } = useAppSelector(state => state.book);
    const { loading: lendingLoading, error: lendingError } = useAppSelector(state => state.lending);
    const { users, usersLoading, error: usersError } = useAppSelector(state => state.user);
    
    // Local state
    const [bookId, setBookId] = useState("");
    const [borrowerName, setBorrowerName] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [borrowerType, setBorrowerType] = useState<'user' | 'custom'>('user');
    const [lendDate, setLendDate] = useState("");
    const [expectedReturnDate, setExpectedReturnDate] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch user's books and users on component mount
    useEffect(() => {
        dispatch(fetchUserAvailableBooks());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    // Clear errors when component mounts
    useEffect(() => {
        dispatch(clearError());
        dispatch(clearUsers());
    }, [dispatch]);

    // Set default lend date to today
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setLendDate(today);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!bookId || !lendDate) {
            return;
        }

        if (borrowerType === 'user' && !selectedUserId) {
            return;
        }

        if (borrowerType === 'custom' && !borrowerName) {
            return;
        }

        try {
            // Get borrower name based on type
            let finalBorrowerName = '';
            if (borrowerType === 'user') {
                const selectedUser = users.find(user => user.id.toString() === selectedUserId);
                finalBorrowerName = selectedUser ? selectedUser.name : '';
            } else {
                finalBorrowerName = borrowerName;
            }

            const lendingData = {
                bookId,
                borrowerName: finalBorrowerName,
                expectedReturnDate: expectedReturnDate || undefined
            };

            await dispatch(lendBook(lendingData)).unwrap();
            
            setSuccess("Book lent successfully!");
            setBookId("");
            setBorrowerName("");
            setSelectedUserId("");
            setBorrowerType('user');
            setLendDate(new Date().toISOString().split('T')[0]);
            setExpectedReturnDate("");
            
            // Navigate to lending history after 2 seconds
            setTimeout(() => {
                navigate("/lent-book-history");
            }, 2000);
            
        } catch (error: any) {
            console.error("Failed to lend book:", error);
        }
    }

    return (
        <div>
            <h2 className="heading-2 mb-8 text-center text-gradient">
                🤝 Lend a Book
            </h2>
            <div className="card max-w-2xl mx-auto">
                {(lendingError || usersError) && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-600">
                        {lendingError || usersError}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg text-success-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-label block mb-2">Select Book</label>
                        <select
                            className="input-field"
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                            required
                            disabled={booksLoading}
                        >
                            <option value="">-- Choose a Book --</option>
                            {userBooks
                                .filter((book: any) => book.status === 'available')
                                .map((book: any) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title} by {book.author}
                                    </option>
                                ))}
                        </select>
                        {booksLoading && (
                            <p className="text-sm text-gray-500 mt-1">Loading your books...</p>
                        )}
                        {!booksLoading && userBooks.filter((book: any) => book.status === 'available').length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No available books to lend. Add some books first!</p>
                        )}
                    </div>

                    <div>
                        <label className="text-label block mb-2">Borrower</label>
                        
                        {/* Borrower Type Selection */}
                        <div className="mb-4">
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="borrowerType"
                                        value="user"
                                        checked={borrowerType === 'user'}
                                        onChange={(e) => setBorrowerType(e.target.value as 'user' | 'custom')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Select from users</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="borrowerType"
                                        value="custom"
                                        checked={borrowerType === 'custom'}
                                        onChange={(e) => setBorrowerType(e.target.value as 'user' | 'custom')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Enter custom name</span>
                                </label>
                            </div>
                        </div>

                        {/* User Selection */}
                        {borrowerType === 'user' && (
                            <div>
                                <select
                                    className="input-field"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    required={borrowerType === 'user'}
                                    disabled={usersLoading}
                                >
                                    <option value="">-- Select a User --</option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {usersLoading && (
                                    <p className="text-sm text-gray-500 mt-1">Loading users...</p>
                                )}
                                {!usersLoading && users.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-1">No users found.</p>
                                )}
                            </div>
                        )}

                        {/* Custom Name Input */}
                        {borrowerType === 'custom' && (
                            <input
                                type="text"
                                className="input-field"
                                value={borrowerName}
                                onChange={(e) => setBorrowerName(e.target.value)}
                                placeholder="Enter borrower's name"
                                required={borrowerType === 'custom'}
                            />
                        )}
                    </div>

                    <div>
                        <label className="text-label block mb-2">Lend Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={lendDate}
                            onChange={(e) => setLendDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-label block mb-2">Expected Return Date (Optional)</label>
                        <input
                            type="date"
                            className="input-field"
                            value={expectedReturnDate}
                            onChange={(e) => setExpectedReturnDate(e.target.value)}
                            min={lendDate}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary w-full"
                        disabled={
                            lendingLoading || 
                            !bookId || 
                            !lendDate || 
                            (borrowerType === 'user' && !selectedUserId) ||
                            (borrowerType === 'custom' && !borrowerName)
                        }
                    >
                        {lendingLoading ? "Lending Book..." : "Lend Book"}
                    </button>
                </form>
            </div>
        </div>
    );
}