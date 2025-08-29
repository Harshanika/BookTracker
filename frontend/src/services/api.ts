// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:4000';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
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

    // ✅ Construct full URL - make sure endpoint starts with /
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    console.log('�� Making API request to:', url); // Debug log
    console.log('📤 Request config:', config); // Debug log

    try {
        const response = await fetch(url, config);
        
        console.log('�� Response status:', response.status); // Debug log
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('❌ API Error:', error); // Debug log
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data); // Debug log
        return data;
    } catch (error: any) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error - please check your connection');
        }
        throw error;
    }
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