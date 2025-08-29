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