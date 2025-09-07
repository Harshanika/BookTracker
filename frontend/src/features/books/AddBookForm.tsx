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
        <div>
            <h2 className="heading-2 mb-8 text-center text-gradient">
                📚 Add New Book to Your Library
            </h2>
            <div className="card max-w-2xl mx-auto">
                {/* ✅ Display error if any */}
                {addBookError && (
                    <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-600">
                        {addBookError}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
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
                </form>
            </div>
        </div>
    );
}