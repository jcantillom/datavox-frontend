// src/services/patients.js
import { apiService } from './api';

export const patientService = {
    /**
     * Busca y lista pacientes por nombre o identificador.
     * @param {string} query - Nombre, ID o Cédula del paciente.
     * @param {number} page
     * @param {number} pageSize
     * @returns {Promise<PatientOut[]>}
     */
    async searchPatients(query = '', page = 1, pageSize = 50) {
        let url = `/patients?page=${page}&page_size=${pageSize}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }
        // Llamada real al backend
        return await apiService.get(url);
    },

    // Método para obtener un paciente (usado en el flujo de citas)
    async getPatientById(patientId) {
        return await apiService.get(`/patients/${patientId}`);
    },

    // (Otros métodos como createPatient, updatePatient, etc., irían aquí)
};