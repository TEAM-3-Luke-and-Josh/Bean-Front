// src/services/apiClient.js

import AuthService from './authService';

class ApiClient {
    static async request(endpoint, options = {}) {
        const baseURL = '/api';
        const url = `${baseURL}${endpoint}`;

        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add auth token if it exists
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Merge options
        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                AuthService.logout(); // Token is invalid or expired
                throw new Error('Session expired. Please login again.');
            }

            // Handle 403 Forbidden
            if (response.status === 403) {
                throw new Error('You do not have permission to perform this action.');
            }

            // Parse JSON response
            const data = await response.json();

            // Handle unsuccessful responses
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
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