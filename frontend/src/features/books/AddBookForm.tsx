import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addBook, clearBooksError } from "../../store/slices/bookSlice";

export default function AddBookForm() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Get Redux state
    const { addBookLoading, addBookError } = useAppSelector(state => state.book);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // ✅ Clear any previous errors
        dispatch(clearBooksError());
        
        // ✅ Check if user is authenticated
        if (!user) {
            navigate('/login');
        }
    }, [dispatch, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !author.trim() || !genre.trim()) {
            return;
        }

        try {
            // ✅ Dispatch Redux action to add book
            const result = await dispatch(addBook({
                title: title.trim(),
                author: author.trim(),
                genre: genre.trim(),
                status: status.trim() as 'available' | 'borrowed',
                description: description.trim() || undefined,
                coverUrl: coverUrl.trim() || undefined,
            })).unwrap();

            console.log('✅ Book added successfully:', result);
            
            // ✅ Clear form and redirect to dashboard
            setTitle("");
            setAuthor("");
            setGenre("");
            setDescription("");
            setCoverUrl("");
            
            // ✅ Navigate to dashboard or user's books
            navigate('/dashboard');
            
        } catch (error) {
            console.error('❌ Failed to add book:', error);
            // ✅ Error is already handled by Redux slice
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-soft">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Add New Book to Your Library</h4>
                        </div>
                        <div className="card-body">
                            {/* ✅ Display error if any */}
                            {addBookError && (
                                <div className="alert alert-danger">
                                    {addBookError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Book Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="Enter book title"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="author" className="form-label">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        required
                                        placeholder="Enter author name"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="genre" className="form-label">
                                        Genre *
                                    </label>
                                    <select
                                        className="form-select"
                                        id="genre"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a genre</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Science Fiction">Science Fiction</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Biography">Biography</option>
                                        <option value="History">History</option>
                                        <option value="Self-Help">Self-Help</option>
                                        <option value="Business">Business</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter book description (optional)"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="coverUrl" className="form-label">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="coverUrl"
                                        value={coverUrl}
                                        onChange={(e) => setCoverUrl(e.target.value)}
                                        placeholder="Enter cover image URL (optional)"
                                    />

                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">
                                        Status *
                                    </label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a status</option>
                                        <option value="available">Available</option>
                                        <option value="borrowed">Borrowed</option>
                                
                                    </select>
                                </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={addBookLoading}
                                    >
                                        {addBookLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Book...
                                            </>
                                        ) : (
                                            'Add Book to Library'
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}