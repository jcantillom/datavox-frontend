// src/services/dashboard.js
import { apiService } from './api';

export const dashboardService = {
    async getMetrics() {
        return await apiService.get('/dashboard/metrics');
    }
};