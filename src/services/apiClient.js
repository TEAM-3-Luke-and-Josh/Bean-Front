// src/services/apiClient.js

import AuthService from './authService';

class ApiClient {
    static async request(endpoint, options = {}) {
        const baseURL = '/api';
        const url = `${baseURL}${endpoint}`;
    
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${AuthService.getToken()}`,
                    ...options.headers,
                },
            });
    
            // Log the response for debugging
            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || `API error: ${response.status}`);
            }
    
            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw new Error(error.message || 'Failed to complete request');
        }
    }

    // Convenience methods for different HTTP verbs
    static get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    static delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export default ApiClient;