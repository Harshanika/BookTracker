import { z } from 'zod';

// User Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Book Management Schemas
export const addBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  author: z
    .string()
    .min(1, 'Author is required')
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name must be less than 100 characters'),
  genre: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || val.length >= 2, {
      message: 'Genre must be at least 2 characters if provided',
    }),
  isbn: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || val.length >= 10, {
      message: 'ISBN must be at least 10 characters if provided',
    }),
  description: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || val.length >= 10, {
      message: 'Description must be at least 10 characters if provided',
    }),
});

export const updateBookSchema = addBookSchema.partial().refine(
  (data: Record<string, any>) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided for update',
  }
);

// Lending Schemas
export const lendBookSchema = z.object({
  bookId: z
    .string()
    .min(1, 'Book selection is required'),
  borrowerName: z
    .string()
    .min(1, 'Borrower name is required')
    .min(2, 'Borrower name must be at least 2 characters')
    .max(100, 'Borrower name must be less than 100 characters'),
  borrowerId: z
    .number()
    .optional(),
  lendDate: z
    .string()
    .min(1, 'Lend date is required')
    .refine((date: string) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, {
      message: 'Lend date cannot be in the past',
    }),
  expectedReturnDate: z
    .string()
    .min(1, 'Expected return date is required')
    .refine((date: string) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, {
      message: 'Expected return date must be in the future',
    }),
}).refine((data: { lendDate: string; expectedReturnDate: string }) => {
  const lendDate = new Date(data.lendDate);
  const expectedReturnDate = new Date(data.expectedReturnDate);
  return expectedReturnDate > lendDate;
}, {
  message: 'Expected return date must be after lend date',
  path: ['expectedReturnDate'],
});

export const returnBookSchema = z.object({
  actualReturnDate: z
    .string()
    .min(1, 'Actual return date is required')
    .refine((date: string) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, {
      message: 'Actual return date cannot be in the future',
    }),
  returnNote: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || val.length <= 500, {
      message: 'Return note must be less than 500 characters',
    }),
});

// Search and Filter Schemas
export const searchSchema = z.object({
  query: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || val.length >= 2, {
      message: 'Search query must be at least 2 characters',
    }),
  status: z
    .enum(['all', 'available', 'borrowed'])
    .optional(),
  genre: z
    .string()
    .optional(),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page must be at least 1'),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100'),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddBookFormData = z.infer<typeof addBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type LendBookFormData = z.infer<typeof lendBookSchema>;
export type ReturnBookFormData = z.infer<typeof returnBookSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type PaginationFormData = z.infer<typeof paginationSchema>;
