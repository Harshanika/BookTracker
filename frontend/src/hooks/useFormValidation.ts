import { useForm, type UseFormReturn, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeAny } from 'zod';

export interface UseFormValidationOptions<T extends FieldValues> {
  schema: ZodTypeAny;
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function useFormValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onChange'
}: UseFormValidationOptions<T>): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
    mode,
  }) as UseFormReturn<T>;
}

// Helper function to get field error message
export function getFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): string | undefined {
  const error = form.formState.errors[fieldName as keyof typeof form.formState.errors];
  return error?.message as string | undefined;
}

// Helper function to check if field has error
export function hasFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return !!form.formState.errors[fieldName as keyof typeof form.formState.errors  ];
}

// Helper function to get field classes for styling
export function getFieldClasses<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
  baseClasses: string = 'form-control'
): string {
  const hasError = hasFieldError(form, fieldName);
  const isDirty = form.formState.dirtyFields[fieldName as keyof typeof form.formState.dirtyFields];
  
  if (hasError) {
    return `${baseClasses} is-invalid`;
  }
  
  if (isDirty) {
    return `${baseClasses} is-valid`;
  }
  
  return baseClasses;
}

// Helper function to get field feedback classes
export function getFieldFeedbackClasses<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): string {
  const hasError = hasFieldError(form, fieldName);
  return hasError ? 'invalid-feedback' : 'valid-feedback';
}

// Helper function to format form errors for display
export function formatFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
): string[] {
  const errors = form.formState.errors;
  const errorMessages: string[] = [];
  
  Object.keys(errors).forEach((key) => {
    const error = errors[key as Path<T>];
    if (error?.message) {
      errorMessages.push(error.message as string);
    }
  });
  
  return errorMessages;
}

// Helper function to check if form is valid and ready to submit
export function isFormReady<T extends FieldValues>(
  form: UseFormReturn<T>
): boolean {
  return form.formState.isValid && !form.formState.isSubmitting;
}

// Helper function to reset form with new values
export function resetFormWithValues<T extends FieldValues>(
  form: UseFormReturn<T>,
  values: Partial<T>
): void {
  form.reset(values as T);
}

// Helper function to set form errors manually
export function setFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Record<string, string>
): void {
  Object.keys(errors).forEach((key) => {
    form.setError(key as Path<T>, {
      type: 'manual',
      message: errors[key],
    });
  });
}

// Helper function to clear form errors
export function clearFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
): void {
  form.clearErrors();
}

export default useFormValidation;
