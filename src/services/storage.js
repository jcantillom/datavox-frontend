// src/services/storage.js
import {apiService} from './api';

export const storageService = {
    async presignPut(data) {
        return await apiService.post('/storage/presign/put', data);
    }
};