// src/services/auth.ts
import { apiRequest } from "./api";

export async function registerUser(data: {
    fullname: string;
    email: string;
    password: string;
}) {
    return apiRequest("/auth/register", "POST", data);
}

export async function loginUser(data: { email: string; password: string }) {
    return apiRequest("/auth/login", "POST", data);
}

export async function getMe() {
    return apiRequest("/auth/me", "GET");
}

