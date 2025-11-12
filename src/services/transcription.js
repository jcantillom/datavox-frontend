// src/services/transcription.js
import {apiService} from './api';

const transcriptionService = {
    async startTranscription(recordingId) {
        return await apiService.post(`/recordings/${recordingId}/transcribe`);
    },

    async getTranscriptionStatus(recordingId) {
        return await apiService.get(`/recordings/${recordingId}/transcription-status`);
    },

    async pollTranscriptionStatus(recordingId, maxAttempts = 30, interval = 5000) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const status = await this.getTranscriptionStatus(recordingId);

            if (status.transcription_status === 'COMPLETED') {
                return status;
            } else if (status.transcription_status === 'FAILED') {
                throw new Error(`Transcription failed: ${status.error}`);
            }

            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, interval));
        }

        throw new Error('Transcription timeout');
    }
};

// Exportación corregida
export {transcriptionService};