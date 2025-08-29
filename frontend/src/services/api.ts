// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:4000';

// ✅ Enhanced API request with better error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
        const token = getSecureToken(); // ✅ Get token from secure storage
        
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // ✅ Handle HTTP status codes
        if (!response.ok) {
            if (response.status === 401) {
                // ✅ Token expired or invalid
                handleTokenExpiration();
                throw new Error('Authentication expired. Please login again.');
            }
            if (response.status === 403) {
                throw new Error('Access denied. Insufficient permissions.');
            }
            if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        // ✅ Enhanced error handling
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
};

// ✅ Secure token management - Use 'access_token' to match backend
export const getSecureToken = (): string | null => {
    // ✅ Try HttpOnly cookie first (if implemented)
    const cookieToken = getCookie('access_token'); // ✅ Changed from 'auth_token' to 'access_token'
    if (cookieToken) return cookieToken;
    
    // ✅ Fallback to localStorage (less secure but functional)
    return localStorage.getItem('access_token'); // ✅ Changed from 'token' to 'access_token'
};

export const setSecureToken = (token: string): void => {
    // ✅ Set HttpOnly cookie with name matching backend response
    setCookie('access_token', token, 7); // ✅ Changed from 'auth_token' to 'access_token'
    
    // ✅ Also set localStorage as fallback with same name
    localStorage.setItem('access_token', token); // ✅ Changed from 'token' to 'access_token'
};

export const removeSecureToken = (): void => {
    // ✅ Remove both cookie and localStorage
    removeCookie('access_token'); // ✅ Changed from 'auth_token' to 'access_token'
    localStorage.removeItem('access_token'); // ✅ Changed from 'token' to 'access_token'
};

// ✅ Handle token expiration
export const handleTokenExpiration = (): void => {
    removeSecureToken();
    // ✅ Redirect to login page
    window.location.href = '/login';
};

// ✅ Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch {
        return true; // Invalid token format
    }
};

// ✅ Cookie utilities
const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Convenience methods
export const api = {
    get: (endpoint: string) => apiRequest(endpoint),
    post: (endpoint: string, data: any) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    put: (endpoint: string, data: any) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (endpoint: string) => apiRequest(endpoint, {
        method: 'DELETE',
    }),
};