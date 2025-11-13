// src/services/transcription.js
import {apiService} from './api';

const transcriptionService = {
    async startTranscription(recordingId) {
        try {
            const response = await apiService.post(`/recordings/${recordingId}/transcribe`);
            return response;
        } catch (error) {
            console.error('Error starting transcription:', error);
            throw new Error(error.message || 'No se pudo iniciar la transcripción');
        }
    },

    async getTranscriptionStatus(recordingId) {
        try {
            const status = await apiService.get(`/recordings/${recordingId}/transcription-status`);
            return status;
        } catch (error) {
            console.error('Error getting transcription status:', error);
            throw new Error(error.message || 'No se pudo obtener el estado de la transcripción');
        }
    },

    async pollTranscriptionStatus(recordingId, maxAttempts = 30, interval = 5000) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const status = await this.getTranscriptionStatus(recordingId);
                console.log(`Transcription attempt ${attempt + 1}:`, status.transcription_status);

                if (status.transcription_status === 'COMPLETED') {
                    return status;
                } else if (status.transcription_status === 'FAILED') {
                    throw new Error(`Transcripción fallida: ${status.error}`);
                } else if (status.transcription_status === 'ERROR') {
                    throw new Error(`Error en transcripción: ${status.error}`);
                }

                // Esperar antes del siguiente intento
                if (status.transcription_status !== 'COMPLETED') {
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                if (attempt === maxAttempts - 1) throw error;

                // Esperar antes de reintentar en caso de error
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }

        throw new Error('Tiempo de espera agotado para la transcripción');
    }
};

export {transcriptionService};