// frontend/src/services/api.ts
const API_URL = "http://localhost:4000"; // 👈 adjust if backend runs on another port

export async function apiRequest<T>(
    endpoint: string,
    method: string = "GET",
    paramsOrBody?: Record<string, any>,
    token: string | null = localStorage.getItem("token"),
): Promise<T> {
    let url = `${API_URL}${endpoint}`;
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let options: RequestInit = { method, headers };

    if (method === "GET" && paramsOrBody) {
        const query = new URLSearchParams(paramsOrBody).toString();
        url += `?${query}`;
    } else if (paramsOrBody) {
        options.body = JSON.stringify(paramsOrBody);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return response.json();
}