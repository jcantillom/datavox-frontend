// src/services/clinical.js
import {apiService} from './api';

export const clinicalService = {
    // Generación de documentos médicos
    async generateMedicalDocument(recordingId, documentType, transcript, metadata) {
        try {
            const payload = {
                recording_id: recordingId,
                document_type: documentType,
                transcript: transcript,
                clinical_meta: metadata, // metadata incluye patient_id, clinical_subject, doctor_name, etc.
            };

            const response = await apiService.post('/documents/generate', payload);

            // Estructura de respuesta adaptada a lo que espera AudioRecorder
            return {
                success: true,
                document_type: response.document_type,
                content: response.content,
                document_id: response.id, // ID del documento creado
                generated_at: response.created_at
            };

        } catch (error) {
            console.error('Error generating medical document:', error);
            throw new Error(error.message || 'Error desconocido al generar documento');
        }
    },

    // -----------------------------------------------------
    // SERVICIOS PARA REPORTES/GESTOR
    // -----------------------------------------------------
    async getDocumentById(documentId) {
        return await apiService.get(`/documents/${documentId}`);
    },

    async listDocuments(filters = {}) {
        const {q, document_type, page = 1, pageSize = 50} = filters;
        let url = `/documents?page=${page}&page_size=${pageSize}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (document_type) url += `&document_type=${document_type}`;

        return await apiService.get(url);
    },

    async updateDocumentContent(documentId, content, isFinalized = false) {
        try {
            const payload = {
                content: content,
                is_finalized: isFinalized,
                is_synced: false // Al editar, asumimos que no está sincronizado
            };

            const response = await apiService.put(`/documents/${documentId}/content`, payload);

            return response; // Devuelve el objeto DocumentOut completo

        } catch (error) {
            console.error('Error updating medical document content:', error);
            throw new Error(error.message || 'Error al guardar los cambios del documento');
        }
    },

    async exportDocument(documentId) {
        // Llama al endpoint de exportación asíncrona (202 Accepted)
        return await apiService.post(`/documents/${documentId}/export`);
    },
};