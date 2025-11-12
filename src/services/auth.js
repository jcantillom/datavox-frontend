// src/services/auth.js
import { apiService } from './api.js';

export const authService = {
    async login(email, password, tenantCode = 'clinica-medellin') {
        try {
            // Primero establecer el tenant code
            apiService.setTenantCode(tenantCode);

            const response = await fetch(`${apiService.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Code': tenantCode,
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('tenantCode', tenantCode);

                // Obtener información del usuario actual
                try {
                    const userInfo = await this.getCurrentUser();
                    return { success: true, user: userInfo };
                } catch (userError) {
                    // Si falla obtener user info, igual guardamos el token
                    console.warn('Could not fetch user info:', userError);
                    return { success: true, user: { email } };
                }
            }

            return { success: false, message: 'No se recibió token de acceso' };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error en el inicio de sesión'
            };
        }
    },

    async getCurrentUser() {
        try {
            const token = localStorage.getItem('authToken');
            const tenantCode = localStorage.getItem('tenantCode');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${apiService.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Code': tenantCode,
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Authentication expired');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const user = await response.json();
            localStorage.setItem('userInfo', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Error fetching user data:', error);
            this.logout();
            throw error;
        }
    },

    // ... resto del código permanece igual
    async refreshToken() {
        try {
            const email = localStorage.getItem('userEmail');

            if (!email) {
                throw new Error('No hay información de usuario para refrescar token');
            }

            const data = await apiService.post('/auth/refresh', { email }, false);

            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                return data.access_token;
            }
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('tenantCode');
        window.location.href = '/login';
    },

    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    getStoredUserInfo() {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo) : null;
        } catch {
            return null;
        }
    },

    getToken() {
        return localStorage.getItem('authToken');
    }
};