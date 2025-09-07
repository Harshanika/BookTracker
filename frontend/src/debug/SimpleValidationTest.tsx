import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schemas/validationSchemas';

export default function SimpleValidationTest() {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange'
    });

    const handleSubmit = (data: LoginFormData) => {
        console.log('Form submitted with data:', data);
    };

    // Debug: Log form state
    console.log('Form state:', {
        isValid: form.formState.isValid,
        errors: form.formState.errors,
        touchedFields: form.formState.touchedFields,
        dirtyFields: form.formState.dirtyFields
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2>Simple Validation Test</h2>
                            <p>Direct useForm without custom hook</p>
                            
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-medium">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            {...form.register('email')}
                                            type="email"
                                            className={`form-control ${form.formState.errors.email ? 'is-invalid' : form.formState.dirtyFields.email ? 'is-valid' : ''}`}
                                            id="email"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {form.formState.errors.email && (
                                        <div className="invalid-feedback">
                                            {form.formState.errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-medium">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            {...form.register('password')}
                                            type="password"
                                            className={`form-control ${form.formState.errors.password ? 'is-invalid' : form.formState.dirtyFields.password ? 'is-valid' : ''}`}
                                            id="password"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    {form.formState.errors.password && (
                                        <div className="invalid-feedback">
                                            {form.formState.errors.password.message}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={!form.formState.isValid}
                                >
                                    Submit
                                </button>
                            </form>

                            {/* Debug Info */}
                            <div className="mt-4 p-3 bg-light">
                                <h5>Debug Info:</h5>
                                <p><strong>Form Valid:</strong> {form.formState.isValid ? 'Yes' : 'No'}</p>
                                <p><strong>Has Email Error:</strong> {form.formState.errors.email ? 'Yes' : 'No'}</p>
                                <p><strong>Email Error Message:</strong> {form.formState.errors.email?.message || 'None'}</p>
                                <p><strong>Has Password Error:</strong> {form.formState.errors.password ? 'Yes' : 'No'}</p>
                                <p><strong>Password Error Message:</strong> {form.formState.errors.password?.message || 'None'}</p>
                                <p><strong>Email Touched:</strong> {form.formState.touchedFields.email ? 'Yes' : 'No'}</p>
                                <p><strong>Password Touched:</strong> {form.formState.touchedFields.password ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

