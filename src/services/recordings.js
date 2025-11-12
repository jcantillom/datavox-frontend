// src/services/recordings.js
import {apiService} from './api';

export const recordingService = {
    async createRecording(data) {
        return await apiService.post('/recordings', data);
    },

    async getRecordings(page = 1, pageSize = 50) {
        return await apiService.get(`/recordings?page=${page}&page_size=${pageSize}`);
    },

    async getRecording(recordingId) {
        return await apiService.get(`/recordings/${recordingId}`);
    },

    async updateRecordingStatus(recordingId, status, errorMessage = null) {
        return await apiService.put(`/recordings/${recordingId}/status`, {
            status,
            error_message: errorMessage
        });
    },

    async attachTranscript(recordingId, transcriptText, durationSec = null) {
        return await apiService.put(`/recordings/${recordingId}/transcript`, {
            transcript_text: transcriptText,
            duration_sec: durationSec
        });
    }
};