import { apiRequest, getSecureToken, handleTokenExpiration, isTokenExpired, setSecureToken } from "./api";

// ✅ Token refresh service
export const refreshToken = async (): Promise<string | null> => {
    try {
        const response = await apiRequest('/auth/refresh', {
            method: 'POST',
        });
        
        if (response.access_token) {
            setSecureToken(response.access_token);
            return response.access_token;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
};

// ✅ Auto-refresh token before expiration
export const setupTokenRefresh = (): void => {
    const checkAndRefreshToken = async () => {
        const token = getSecureToken();
        if (token && isTokenExpired(token)) {
            const newToken = await refreshToken();
            if (!newToken) {
                handleTokenExpiration();
            }
        }
    };
    
    // ✅ Check every 5 minutes
    setInterval(checkAndRefreshToken, 5 * 60 * 1000);
};