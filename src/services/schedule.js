// src/services/schedule.js
import { apiService } from './api';

export const scheduleService = {
    /**
     * Obtiene la agenda diaria del médico logueado.
     * @param {string} date - Fecha en formato YYYY-MM-DD. Si es nulo, el backend asume hoy.
     * @returns {Promise<AppointmentOut[]>}
     */
    async getDailySchedule(date) {
        let url = '/schedule/daily';
        if (date) {
            url += `?date=${date}`;
        }
        return await apiService.get(url);
    },

    // (Otros métodos como createAppointment, updateAppointmentStatus, etc., irían aquí)
};