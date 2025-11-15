import React, {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {
    FileText, Search, User, Clock, CheckCircle, AlertCircle, Radiation,
    Stethoscope, Pill, Download, MessageSquare, ClipboardList, RotateCcw
} from 'lucide-react';
import {clinicalService} from '../services/clinical';
import PaginationControls from '../components/ui/PaginationControls';

// Definición de tipos de documentos (para color y mapeo)
const DOCUMENT_TYPES_MAP = {
    clinical_history: {label: 'Historia Clínica', color: 'indigo', icon: Stethoscope},
    radiology_report: {label: 'Informe Radiológico', color: 'amber', icon: Radiation},
    medical_prescription: {label: 'Fórmula Médica', color: 'emerald', icon: Pill},
    medical_certificate: {label: 'Certificado Médico', color: 'purple', icon: FileText},
    incapacity: {label: 'Incapacidad', color: 'red', icon: ClipboardList}
};

const PAGE_SIZE = 6; // Constante para tamaño de página

const Reports = ({onViewDocument, notifications, tenantMetadata}) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    // NUEVOS ESTADOS DE PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const {success, error: notifyError, info} = notifications;

    // Bandera para evitar la notificación en la primera carga (YA NO ES NECESARIA, pero la dejamos por si acaso)
    const isInitialMount = useRef(true);

    // **CAMBIO CLAVE 1:** Este efecto ahora controla la recarga automática al cambiar filtros.
    useEffect(() => {
        // Al cambiar los filtros o el query, reiniciamos a la página 1.
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            // Si ya estamos en la página 1, cargamos inmediatamente.
            // Usamos 'false' para no notificar al usuario en cada pulsación de tecla.
            loadDocuments(false);
        }
    }, [searchQuery, filterType]);

    // **CAMBIO CLAVE 2:** Este efecto se dispara solo cuando cambia la página.
    useEffect(() => {
        // Este efecto recarga si currentPage cambia (por paginador) o si es la carga inicial.
        loadDocuments(false);
    }, [currentPage]);

    // Función modificada para controlar la notificación
    const loadDocuments = async (notifyOnComplete = true) => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                q: searchQuery,
                document_type: filterType,
                page: currentPage, // USAR currentPage
                pageSize: PAGE_SIZE, // USAR PAGE_SIZE
            };

            const result = await clinicalService.listDocuments(filters);

            setDocuments(result.data || []);
            setTotalDocuments(result.total || 0);

            if (notifyOnComplete) {
                info(`Listado de reportes actualizado. ${result.total} documentos encontrados.`, 3000);
            }
        } catch (err) {
            console.error("Error cargando documentos:", err);
            setError("No se pudieron cargar los reportes clínicos.");
            notifyError("Error de conexión: No se pudieron cargar los reportes.", 8000);
            setDocuments([]);
            setTotalDocuments(0);
        } finally {
            setLoading(false);
        }
    };

    // **CAMBIO CLAVE 3:** Eliminamos handleManualLoad, pero la lógica de 'Actualizar' debe recargar con notificación.
    const handleRefreshLoad = () => {
        if (currentPage !== 1) {
            setCurrentPage(1); // Esto dispara el useEffect y luego loadDocuments(false)
        } else {
            loadDocuments(true); // Recarga la página actual con notificación
        }
    }

    const totalPages = Math.ceil(totalDocuments / PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleExportToHis = async (docId, title) => {
        try {
            setLoading(true);
            info(`Iniciando exportación de "${title}"...`, 5000);
            const response = await clinicalService.exportDocument(docId);

            loadDocuments(false); // Recarga sutil tras la acción

            success(`Documento "${title}" enviado al HIS (Proceso Asíncrono Iniciado).`, 7000);
        } catch (e) {
            notifyError(`Fallo en exportación: ${e.message}`, 8000);
        } finally {
            setLoading(false);
        }
    }

    const docTypeOptions = Object.entries(DOCUMENT_TYPES_MAP).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));


    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            <div
                className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50">
                <h2 className="text-3xl font-bold text-gray-900">📄 Historial de Documentos Generados</h2>
                <motion.button
                    onClick={handleRefreshLoad} // Usamos la nueva función para recargar/notificar
                    className="p-3 bg-indigo-500/10 text-indigo-600 rounded-full hover:bg-indigo-500/20 transition-colors"
                    whileHover={{rotate: 90}}
                >
                    <RotateCcw className="w-5 h-5"/>
                </motion.button>
            </div>

            {/* Filtros y Búsqueda */}
            {/* **CAMBIO CLAVE 4:** Eliminamos la columna y el botón "Aplicar Filtros". */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/70 rounded-2xl shadow-md border border-gray-100">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Buscar por paciente o contenido..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                    <option value="">Todos los Tipos</option>
                    {docTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-600">Cargando
                    reportes...</div>
            ) : error ? (
                <div
                    className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl text-red-700 font-semibold">
                    <AlertCircle className="w-6 h-6 mx-auto mb-3"/>
                    {error}
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-500">
                    No se encontraron documentos con los filtros aplicados.
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Tarjetas de Documentos (Solo 5 por página) */}
                    {documents.map((doc) => {
                        const typeConfig = DOCUMENT_TYPES_MAP[doc.document_type] || DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;
                        const statusColor = doc.is_synced ? 'green' : doc.is_finalized ? 'blue' : 'amber';
                        const statusText = doc.is_synced ? 'Sincronizado HIS' : doc.is_finalized ? 'Finalizado' : 'Borrador';

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-gray-200/50 flex justify-between items-start hover:shadow-xl transition-all"
                                whileHover={{scale: 1.005}}
                            >
                                <div className="flex space-x-4 flex-1 min-w-0">
                                    <div
                                        className={`p-3 rounded-xl bg-${typeConfig.color}-500/10 border border-${typeConfig.color}-200 flex items-center justify-center`}>
                                        <DocIcon className={`w-6 h-6 text-${typeConfig.color}-600`}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{doc.title}</h3>
                                        <p className="text-gray-600 text-sm truncate max-w-full">
                                            Paciente ID: <span
                                            className="font-semibold text-blue-600">{doc.clinical_meta.patient_id || 'N/A'}</span>
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs mt-2 text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <User className="w-3 h-3"/>
                                                <span>{doc.clinical_meta.doctor_name || 'Desconocido'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3"/>
                                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones y Estado */}
                                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusColor}-500/10 text-${statusColor}-700 border border-${statusColor}-200`}>
                                        {statusText}
                                    </span>
                                    <div className="flex space-x-2">
                                        <motion.button
                                            title="Ver/Editar Documento"
                                            className="p-2 bg-blue-50/70 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                                            whileHover={{scale: 1.1}}
                                            // Llamada al Dashboard para cambiar la vista
                                            onClick={() => onViewDocument(doc.id)}
                                        >
                                            <MessageSquare className="w-4 h-4"/>
                                        </motion.button>

                                        {!doc.is_synced && doc.is_finalized && (
                                            <motion.button
                                                title="Exportar a HIS"
                                                className="p-2 bg-emerald-500/10 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                whileHover={{scale: 1.1}}
                                                onClick={() => handleExportToHis(doc.id, doc.title)}
                                            >
                                                <Download className="w-4 h-4"/>
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Componente de Paginación */}
            {!loading && totalPages > 1 && (
                <div className="mt-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default Reports;