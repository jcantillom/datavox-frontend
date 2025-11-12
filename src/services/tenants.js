// src/services/tenants.js
import { apiService } from './api.js';

export const tenantService = {
    async getAllTenants() {
        return await apiService.get('/tenants');
    },

    async getTenantByCode(code) {
        return await apiService.get(`/tenants/by-code?code=${code}`);
    },

    async createTenant(tenantData) {
        return await apiService.post('/tenants', tenantData);
    },

    async updateTenantName(tenantId, name) {
        return await apiService.put(`/tenants/${tenantId}/name`, { name });
    },

    async updateTenantCode(tenantId, code) {
        return await apiService.put(`/tenants/${tenantId}/code`, { code });
    },

    async updateTenantStatus(tenantId, isActive) {
        return await apiService.put(`/tenants/${tenantId}/status`, { is_active: isActive });
    },

    async updateTenantMeta(tenantId, meta) {
        return await apiService.put(`/tenants/${tenantId}/meta`, { meta });
    },

    async partialUpdateTenant(tenantId, updateData) {
        return await apiService.patch(`/tenants/${tenantId}`, updateData);
    }
};