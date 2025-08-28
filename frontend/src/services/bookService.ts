import { LentBook } from "../features/books/types";
import { apiRequest } from "./api";

const API_BASE_URL = "http://localhost:4000/api/books";

export const bookService = {
    getAllBooks: async (): Promise<any[]> => {
        return await apiRequest(`/api/books`, "GET");
    },

    getLentBooks: async (): Promise<LentBook[]> => {
        return await apiRequest(`/api/books/lent`, "GET");
    },

    // getBookById: async (id: string): Promise<Book> =>  {
    //     return await apiRequest(`api/book/get`, `/${id}`, "GET");
    // },

    addBook: async (book: any): Promise<any> => {
        return await apiRequest(`api/book/add`, "POST", book);
    },

    // updateBook: async (id: string, book: any): Promise<any> => {
    //     return await apiRequest<any>(API_BASE_URL, `/${id}`, "PUT", book);
    // },
    //
    // deleteBook: async (id: string): Promise<any> => {
    //     return await apiRequest<any>(API_BASE_URL, `/${id}`, "DELETE");
    // },
};
