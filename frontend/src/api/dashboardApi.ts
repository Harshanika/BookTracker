// frontend/src/api/dashboardApi.ts
import { apiRequest } from "../services/api";

export type Book = {
    id: string;
    title: string;
    author: string;
    // add other fields as needed
};

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
};

export async function userOwned(page = 1, pageSize = 10): Promise<PaginatedResponse<Book>> {
    return apiRequest(`/api/dashboard/owned?page=${page}&pageSize=${pageSize}`, "GET");
}

export async function userBorrowed(page = 1, pageSize = 10): Promise<PaginatedResponse<Book>> {
    return apiRequest(`/api/dashboard/borrowed?page=${page}&pageSize=${pageSize}`, "GET");
}

export async function userOverDue(page = 1, pageSize = 10): Promise<PaginatedResponse<Book>> {
    return apiRequest(`/api/dashboard/overdue?page=${page}&pageSize=${pageSize}`, "GET");
}