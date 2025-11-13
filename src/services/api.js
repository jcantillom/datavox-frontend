// src/services/api.js - VERSIÓN PROFESIONAL MEJORADA
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.tenantCode = localStorage.getItem('tenantCode') || 'clinica-medellin';
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    setTenantCode(tenantCode) {
        this.tenantCode = tenantCode;
        localStorage.setItem('tenantCode', tenantCode);
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Tenant-Code': this.tenantCode,
            'X-Client-Type': 'datavox-medical-web',
            'X-Client-Version': '1.0.0'
        };

        if (includeAuth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    async handleResponse(response) {
        if (!response.ok) {
            // Manejo específico de errores HTTP
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
            }

            if (response.status === 403) {
                throw new Error('No tiene permisos para realizar esta acción.');
            }

            if (response.status === 404) {
                throw new Error('Recurso no encontrado.');
            }

            if (response.status >= 500) {
                throw new Error('Error del servidor. Por favor intente más tarde.');
            }

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Error: ${response.status}`);
        }

        // Para respuestas sin contenido (204)
        if (response.status === 204) {
            return {success: true};
        }

        return response.json();
    }

    async request(url, options, includeAuth = true) {
        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                ...options,
                headers: this.getHeaders(includeAuth),
            });

            return await this.handleResponse(response);
        } catch (error) {
            // Reintentar en caso de error de red
            if (this.retryCount < this.maxRetries && error.message.includes('Network')) {
                this.retryCount++;
                console.warn(`Reintentando request (${this.retryCount}/${this.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
                return this.request(url, options, includeAuth);
            }

            this.retryCount = 0;
            throw error;
        }
    }

    async get(url, includeAuth = true) {
        return this.request(url, {method: 'GET'}, includeAuth);
    }

    async post(url, data, includeAuth = true) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }, includeAuth);
    }

    async put(url, data, includeAuth = true) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, includeAuth);
    }

    async patch(url, data, includeAuth = true) {
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }, includeAuth);
    }

    async delete(url, includeAuth = true) {
        return this.request(url, {method: 'DELETE'}, includeAuth);
    }

    // Método específico para upload de archivos
    async upload(url, formData, includeAuth = true) {
        const headers = this.getHeaders(includeAuth);
        delete headers['Content-Type']; // Dejar que el browser lo establezca

        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();
