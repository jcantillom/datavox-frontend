// src/pages/Patients.jsx
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Users, Calendar, FileText, Search, UserCheck, Stethoscope, RotateCcw, AlertCircle} from 'lucide-react';
import {patientService} from '../services/patients'; // Importar servicio real
import PaginationControls from '../components/ui/PaginationControls';

const PatientCard = ({name, id, identifier, created_at, is_active}) => {
    const statusText = is_active ? 'Activo' : 'Inactivo';
    const statusClass = is_active ? 'text-emerald-500' : 'text-red-500';

    return (
        <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-md border border-gray-200/50 hover:shadow-lg transition-all flex items-center justify-between"
            initial={{opacity: 0, x: -10}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.4}}
        >
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    is_active ? 'bg-emerald-500/20 text-emerald-700' : 'bg-blue-500/20 text-blue-700'
                }`}>
                    <UserCheck className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500">ID: {identifier}</p>
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm font-semibold text-gray-700 flex items-center space-x-2 justify-end">
                    <Calendar className="w-4 h-4 text-purple-500"/>
                    {/* Usamos created_at como proxy para la fecha de registro/última visita */}
                    <span>Registro: {new Date(created_at).toLocaleDateString()}</span>
                </p>
                <p className={`text-xs mt-1 font-medium ${statusClass}`}>
                    Estado: {statusText}
                </p>
            </div>
        </motion.div>
    );
};

const PAGE_SIZE = 5; // Constante para tamaño de página

const Patients = ({notifications}) => { // Recibe notifications
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // NUEVOS ESTADOS DE PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);

    const { error: notifyError, info } = notifications;

    useEffect(() => {
        // Al cambiar el query de búsqueda, volvemos a la página 1.
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        loadPatients(false); // Siempre recargamos al cambiar la página
    }, [currentPage]);


    const loadPatients = async (notifyOnComplete = true) => {
        setLoading(true);
        setError(null);
        try {
            // CAMBIO: Pasa la página y obtiene { data, total }
            const result = await patientService.searchPatients(searchQuery, currentPage, PAGE_SIZE);

            // CORRECCIÓN CLAVE: Asignar el array de pacientes de result.data
            setPatients(result.data || []);
            setTotalPatients(result.total || 0); // GUARDAR TOTAL

            if (notifyOnComplete) {
                info(`Listado de pacientes actualizado. ${result.total} pacientes encontrados.`, 3000);
            }

        } catch (err) {
            console.error("Error cargando pacientes:", err);
            // Mensaje de error general para el usuario
            setError(err.message || "No se pudieron cargar los pacientes activos.");
            notifyError("Error de conexión: No se pudieron cargar los pacientes.", 8000);
            setPatients([]);
            setTotalPatients(0); // Reiniciar en caso de error
        } finally {
            setLoading(false);
        }
    };

    const handleManualLoad = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadPatients(true);
        }
    }

    const totalPages = Math.ceil(totalPatients / PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <Users className="w-8 h-8 text-emerald-600"/>
                    <span>Gestión de Pacientes Activos</span>
                </h2>
                <p className="text-gray-600 mt-2">Busque historiales, documentos asociados y próxima cita.</p>
            </div>

            {/* Búsqueda y Acciones */}
            <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/70 rounded-2xl shadow-md border border-gray-100">
                <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Buscar por ID, Nombre o Cédula..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
                <motion.button
                    onClick={handleManualLoad}
                    className="py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl font-semibold shadow-md hover:from-emerald-500 hover:to-green-400 transition-all"
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Stethoscope className="w-4 h-4"/>
                        <span>Buscar Pacientes</span>
                    </div>
                </motion.button>
                <button
                    className="py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all"
                    onClick={() => alert("Función de Agendar Cita requiere la ID de un paciente.")}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4"/>
                        <span>Agendar Cita</span>
                    </div>
                </button>
            </div>

            {loading ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-600">Cargando lista de
                    pacientes...</div>
            ) : error ? (
                <div
                    className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl text-red-700 font-semibold">
                    <AlertCircle className="w-6 h-6 mx-auto mb-3"/>
                    {error}
                </div>
            ) : patients.length === 0 ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-500">
                    No se encontraron pacientes activos con los filtros aplicados.
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Pacientes Recientes ({totalPatients})</h3>
                    {/* Tarjetas de Pacientes (Solo 5 por página) */}
                    {patients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            name={patient.full_name}
                            id={patient.id}
                            identifier={patient.identifier}
                            created_at={patient.created_at}
                            is_active={patient.is_active}
                        />
                    ))}
                </div>
            )}

            {/* Componente de Paginación */}
            {!loading && totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

        </motion.div>
    );
};

export default Patients;