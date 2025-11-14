// src/pages/Schedule.jsx
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Calendar, Clock, User, Bell, Plus, Users, RotateCcw, AlertCircle} from 'lucide-react';
import {scheduleService} from '../services/schedule'; // Importar servicio real
import {patientService} from '../services/patients'; // Para obtener el nombre del paciente (simulación)


const AppointmentCard = ({start_time, end_time, patient_id, reason, status, patientName}) => {
    const statusConfig = {
        scheduled: {bg: 'bg-blue-500/10', text: 'text-blue-700', icon: Clock, label: 'Programada'},
        completed: {bg: 'bg-emerald-500/10', text: 'text-emerald-700', icon: User, label: 'Completada'},
        cancelled: {bg: 'bg-red-500/10', text: 'text-red-700', icon: Bell, label: 'Cancelada'},
        missed: {bg: 'bg-yellow-500/10', text: 'text-yellow-700', icon: Bell, label: 'Perdida'},
    };
    const config = statusConfig[status.toLowerCase()] || statusConfig.scheduled;
    const Icon = config.icon;

    // Formatear hora: HH:MM AM/PM
    const timeDisplay = new Date(start_time).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});

    return (
        <motion.div
            className={`p-4 rounded-xl border border-gray-200/50 shadow-sm flex items-center justify-between ${config.bg}`}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
        >
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${config.text} border border-current`}>
                    <Icon className="w-5 h-5"/>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-900">{timeDisplay}</p>
                    <p className="text-sm font-semibold text-gray-700 flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-500"/>
                        {/* Muestra el nombre si está disponible, sino la ID */}
                        <span>{patientName || `ID: ${patient_id.substring(0, 8)}...`}</span>
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold text-sm ${config.text}`}>{config.label}</p>
                <p className="text-xs text-gray-500 mt-1">Motivo: {reason}</p>
            </div>
        </motion.div>
    );
}

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Hoy por defecto

    useEffect(() => {
        loadAppointments();
    }, [selectedDate]);

    // Función para obtener y enriquecer los datos de las citas
    const loadAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const rows = await scheduleService.getDailySchedule(selectedDate);

            // OPTIMIZACIÓN: Fetch de nombres de pacientes (simulación de join)
            const patientPromises = rows.map(app =>
                patientService.getPatientById(app.patient_id)
                    .then(patient => ({...app, patientName: patient.full_name}))
                    .catch(() => ({...app, patientName: 'Paciente Desconocido'}))
            );

            const enrichedAppointments = await Promise.all(patientPromises);

            setAppointments(enrichedAppointments);

        } catch (err) {
            console.error("Error cargando citas:", err);
            setError(err.message || "No se pudieron cargar las citas para la fecha seleccionada.");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }

    const todayAppointmentsCount = appointments.filter(a => a.status.toLowerCase() === 'scheduled').length;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            <div
                className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-purple-600"/>
                    <span>Agenda Médica Diaria</span>
                </h2>
                <div className="flex items-center space-x-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="p-2 border border-gray-300 rounded-xl text-gray-700"
                    />
                    <motion.button
                        onClick={loadAppointments}
                        className="p-3 bg-purple-500/10 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                        whileHover={{rotate: 90}}
                    >
                        <RotateCcw className="w-5 h-5"/>
                    </motion.button>
                </div>
            </div>

            {/* Acciones de Agenda */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                    className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:from-purple-500 hover:to-pink-400 transition-all"
                    whileTap={{scale: 0.98}}
                    onClick={() => alert("Abrir modal para crear nueva cita")}
                >
                    <Plus className="w-4 h-4"/>
                    <span>Nueva Cita</span>
                </motion.button>
                <motion.button
                    className="flex items-center justify-center space-x-2 py-3 bg-white/80 border border-gray-300 text-gray-700 rounded-xl font-semibold shadow-md hover:bg-gray-100 transition-all"
                    whileTap={{scale: 0.98}}
                    onClick={() => alert("Redirigir a /dashboard/patients")}
                >
                    <Users className="w-4 h-4"/>
                    <span>Ver Pacientes</span>
                </motion.button>
            </div>

            {loading ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-600">Cargando
                    citas...</div>
            ) : error ? (
                <div
                    className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl text-red-700 font-semibold">
                    <AlertCircle className="w-6 h-6 mx-auto mb-3"/>
                    {error}
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-500">
                    No hay citas programadas para esta fecha.
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-600"/>
                        <span>Citas para {new Date(selectedDate).toLocaleDateString()} ({appointments.length})</span>
                    </h3>
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            start_time={appointment.start_time}
                            end_time={appointment.end_time}
                            patient_id={appointment.patient_id}
                            reason={appointment.reason}
                            status={appointment.status}
                            patientName={appointment.patientName}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Schedule;