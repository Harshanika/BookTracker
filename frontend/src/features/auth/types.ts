// Add an interface for the response
export interface LoginResponse {
    access_token: string;
}

export interface RegisterResponse {
    id: number;        // User ID returned from backend
    name: string;      // Registered user's name
    email: string;     // Registered user's email
    message?: string;  // Optional success message
}

export interface CountResponse {
    count: number;
}

// Example User type
export interface User  {
    id: string;
    name: string;
    email: string;
    // add other fields as needed
}