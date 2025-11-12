// src/services/users.js
import { apiService } from './api.js';

export const userService = {
    async getAllUsers(page = 1, pageSize = 50) {
        return await apiService.get(`/users?page=${page}&page_size=${pageSize}`);
    },

    async createUser(userData) {
        return await apiService.post('/users', userData);
    },

    async updateUserName(userId, fullName) {
        return await apiService.put(`/users/${userId}/name`, { full_name: fullName });
    },

    async changePassword(currentPassword, newPassword) {
        return await apiService.put('/users/me/password', {
            current_password: currentPassword,
            new_password: newPassword
        });
    },

    async updateUserStatus(userId, isActive) {
        return await apiService.put(`/users/${userId}/active`, { is_active: isActive });
    }
};