import ApiClient from './apiClient';

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
            const data = await ApiClient.post('/auth/login', { 
                username, 
                password 
            });

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
            // Handle specific error cases
            if (error.message.includes('405')) {
                throw new Error('Login endpoint not available. Please contact system administrator.');
            }
            if (error.message.includes('401') || error.message.includes('403')) {
                throw new Error('Invalid username or password');
            }
            if (error.message.includes('404')) {
                throw new Error('Login service not found');
            }
            if (error.message.includes('500')) {
                throw new Error('Server error. Please contact administration.');
            }
            // Network errors
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Server unavailable. Please check if the server is running');
            }
            // Generic error fallback
            throw new Error(error.message || 'Login failed. Please try again');
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