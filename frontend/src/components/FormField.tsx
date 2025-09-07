import React from 'react';
import { UseFormReturn, Path, FieldValues } from 'react-hook-form';
import { getFieldError, getFieldClasses, getFieldFeedbackClasses } from '../hooks/useFormValidation';

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  className = '',
  labelClassName = '',
  inputClassName = '',
}: FormFieldProps<T>) {
  const error = getFieldError(form, name);
  const fieldClasses = getFieldClasses(form, name, inputClassName);
  const feedbackClasses = getFieldFeedbackClasses(form, name);

  const renderInput = () => {
    const commonProps = {
      ...form.register(name),
      className: fieldClasses,
      placeholder,
      disabled,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            id={name}
          />
        );

      case 'select':
        return (
          <select {...commonProps} id={name}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            id={name}
          />
        );

      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
            id={name}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            id={name}
          />
        );
    }
  };

  return (
    <div className={`${className}`}>
      <label htmlFor={name} className={`text-label block mb-2 ${labelClassName}`}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <div className="position-relative">
        {renderInput()}
      </div>
      {error && (
        <div id={`${name}-error`} className={feedbackClasses}>
          {error}
        </div>
      )}
    </div>
  );
}

// Specialized form field components
export function TextField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="text" />;
}

export function EmailField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="email" />;
}

export function PasswordField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="password" />;
}

export function NumberField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="number" />;
}

export function DateField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="date" />;
}

export function TextAreaField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="textarea" />;
}

export function SelectField<T extends FieldValues>(props: Omit<FormFieldProps<T>, 'type'>) {
  return <FormField {...props} type="select" />;
}

export default FormField;
