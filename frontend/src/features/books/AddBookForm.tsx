import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addBook, clearBooksError } from "../../store/slices/bookSlice";
import { useFormValidation } from "../../hooks/useFormValidation";
import { addBookSchema, AddBookFormData } from "../../schemas/validationSchemas";
import { TextField, TextAreaField, SelectField } from "../../components/FormField";
import { FormFieldSkeleton } from "../../components/SkeletonLoader";

export default function AddBookForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // ✅ Get Redux state
    const { addBookLoading, addBookError } = useAppSelector(state => state.book);
    const { user } = useAppSelector(state => state.auth);
    
    const form = useFormValidation<AddBookFormData>({
        schema: addBookSchema,
        defaultValues: {
            title: '',
            author: '',
            genre: '',
            isbn: '',
            description: '',
        },
        mode: 'onChange'
    });

    useEffect(() => {
        // ✅ Clear any previous errors
        dispatch(clearBooksError());
        
        // ✅ Check if user is authenticated
        if (!user) {
            navigate('/login');
        }
    }, [dispatch, user, navigate]);

    const handleSubmit = async (data: AddBookFormData) => {
        try {
            // ✅ Dispatch Redux action to add book
            const result = await dispatch(addBook({
                title: data.title.trim(),
                author: data.author.trim(),
                genre: data.genre?.trim() || '',
                status: 'available' as 'available' | 'borrowed',
                description: data.description?.trim() || undefined,
            })).unwrap();

            console.log('✅ Book added successfully:', result);
            
            // ✅ Clear form and redirect to dashboard
            form.reset();
            
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

                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <TextField
                                    form={form}
                                    name="title"
                                    label="Book Title"
                                    placeholder="Enter book title"
                                    required
                                />

                                <TextField
                                    form={form}
                                    name="author"
                                    label="Author"
                                    placeholder="Enter author name"
                                    required
                                />

                                <SelectField
                                    form={form}
                                    name="genre"
                                    label="Genre"
                                    options={[
                                        { value: '', label: 'Select a genre' },
                                        { value: 'Fiction', label: 'Fiction' },
                                        { value: 'Non-Fiction', label: 'Non-Fiction' },
                                        { value: 'Mystery', label: 'Mystery' },
                                        { value: 'Romance', label: 'Romance' },
                                        { value: 'Science Fiction', label: 'Science Fiction' },
                                        { value: 'Fantasy', label: 'Fantasy' },
                                        { value: 'Biography', label: 'Biography' },
                                        { value: 'History', label: 'History' },
                                        { value: 'Self-Help', label: 'Self-Help' },
                                        { value: 'Business', label: 'Business' },
                                        { value: 'Technology', label: 'Technology' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                />

                                <TextField
                                    form={form}
                                    name="isbn"
                                    label="ISBN"
                                    placeholder="Enter ISBN (optional)"
                                />

                                <TextAreaField
                                    form={form}
                                    name="description"
                                    label="Description"
                                    placeholder="Enter book description (optional)"
                                    rows={3}
                                />

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={addBookLoading || !form.formState.isValid}
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