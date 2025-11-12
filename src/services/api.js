// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.tenantCode = localStorage.getItem('tenantCode') || 'clinica-medellin';
    }

    setTenantCode(tenantCode) {
        this.tenantCode = tenantCode;
        localStorage.setItem('tenantCode', tenantCode);
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Tenant-Code': this.tenantCode,
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    async get(url, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'GET',
            headers: this.getHeaders(includeAuth),
        });
        return this.handleResponse(response);
    }

    async post(url, data, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'POST',
            headers: this.getHeaders(includeAuth),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async put(url, data, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'PUT',
            headers: this.getHeaders(includeAuth),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async patch(url, data, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'PATCH',
            headers: this.getHeaders(includeAuth),
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async delete(url, includeAuth = true) {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'DELETE',
            headers: this.getHeaders(includeAuth),
        });
        return this.handleResponse(response);
    }
}

export const apiService = new ApiService();