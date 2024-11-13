// src/services/authService.js

const TOKEN_KEY = 'jwt_token';

class AuthService {
    static getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    static removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static async login(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Check if the server responded
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid username or password');
                }
                if (response.status === 404) {
                    throw new Error('Server endpoint not found');
                }
                if (response.status >= 500) {
                    throw new Error('Server error. Please contact administration.');
                }
                throw new Error('Login failed. Please try again');
            }

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Server unavailable. Please check your connection and try again');
            }

            if (data.token) {
                this.setToken(data.token);
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('username', data.username);
                return {
                    success: true,
                    userType: data.userType,
                    username: data.username
                };
            }
            throw new Error('Invalid server response');
        } catch (error) {
            // Check if it's a network error (server unreachable)
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Server unavailable. Please check if the server is running');
            }
            // Rethrow the error with our custom message
            throw error;
        }
    }


    static getUserInfo() {
        return {
            username: localStorage.getItem('username'),
            userType: localStorage.getItem('userType'),
            token: this.getToken()
        };
    }

    static logout() {
        this.removeToken();
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        window.location.href = '/login';
    }
}

export default AuthService;