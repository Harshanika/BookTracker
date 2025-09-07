import React from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { loginSchema, LoginFormData } from '../schemas/validationSchemas';
import { EmailField, PasswordField } from '../components/FormField';

export default function ValidationTest() {
    const form = useFormValidation<LoginFormData>({
        schema: loginSchema,
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
        emailError: form.formState.errors.email?.message,
        passwordError: form.formState.errors.password?.message,
        emailTouched: form.formState.touchedFields.email,
        passwordTouched: form.formState.touchedFields.password
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2>Validation Test</h2>
                            <p>Try typing invalid data to see validation messages</p>
                            
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <EmailField
                                    form={form}
                                    name="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    required
                                />

                                <PasswordField
                                    form={form}
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    required
                                />

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

