// src/services/patients.js
import { apiService } from './api';

export const patientService = {
    /**
     * Busca y lista pacientes por nombre o identificador.
     * @param {string} query - Nombre, ID o Cédula del paciente.
     * @param {number} page
     * @param {number} pageSize
     * @returns {Promise<{data: PatientOut[], total: number}>}
     */
    async searchPatients(query = '', page = 1, pageSize = 5) { // CAMBIO: pageSize por defecto a 5
        let url = `/patients?page=${page}&page_size=${pageSize}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }
        // Llamada real al backend
        // CAMBIO: El apiService.get devolverá { data: PatientOut[], total: number }
        return await apiService.get(url);
    },

    // Método para obtener un paciente (usado en el flujo de citas)
    async getPatientById(patientId) {
        return await apiService.get(`/patients/${patientId}`);
    },

    // (Otros métodos como createPatient, updatePatient, etc., irían aquí)
};