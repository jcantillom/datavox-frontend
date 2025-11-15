import React, {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {
    FileText, Search, User, Clock, CheckCircle, AlertCircle, Radiation,
    Stethoscope, Pill, Download, MessageSquare, ClipboardList, RotateCcw,
    Upload, Edit3, Briefcase, Calendar, AlignLeft, Send, Check
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const {success, error: notifyError, info} = notifications;

    useEffect(() => {
        // Al cambiar los filtros o el query, reiniciamos a la página 1.
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadDocuments(false);
        }
    }, [searchQuery, filterType]);

    useEffect(() => {
        loadDocuments(false);
    }, [currentPage]);

    // Función modificada para controlar la recarga
    const loadDocuments = async (notifyOnComplete = true) => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                q: searchQuery,
                document_type: filterType,
                page: currentPage,
                pageSize: PAGE_SIZE,
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

    const handleRefreshLoad = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadDocuments(true);
        }
    }

    const handleExportToHis = async (docId, title) => {
        try {
            setLoading(true);
            info(`Iniciando exportación de "${title}"...`, 5000);
            const response = await clinicalService.exportDocument(docId);

            loadDocuments(false);

            success(`Documento "${title}" enviado al HIS (Proceso Asíncrono Iniciado).`, 7000);
        } catch (e) {
            notifyError(`Fallo en exportación: ${e.message}`, 8000);
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(totalDocuments / PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                    onClick={handleRefreshLoad}
                    className="p-3 bg-indigo-500/10 text-indigo-600 rounded-full hover:bg-indigo-500/20 transition-colors"
                    whileHover={{rotate: 90}}
                >
                    <RotateCcw className="w-5 h-5"/>
                </motion.button>
            </div>

            {/* Filtros y Búsqueda */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-inner border border-gray-100">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Buscar por paciente o contenido..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200"
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
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                >
                    {/* Listado de Tarjetas */}
                    {documents.map((doc) => {
                        const typeConfig = DOCUMENT_TYPES_MAP[doc.document_type] || DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;

                        const statusColor = doc.is_synced ? 'emerald' : doc.is_finalized ? 'indigo' : 'amber';
                        const statusText = doc.is_synced ? 'Sincronizado HIS' : doc.is_finalized ? 'Finalizado' : 'Borrador';

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{opacity: 0, y: 15}}
                                animate={{opacity: 1, y: 0}}
                                // ESTILO NEUMÓRFICO Y GRADIENTE DE ALTO RELIEVE
                                className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 shadow-2xl border-2 border-transparent 
                                            transition-all duration-500 relative overflow-hidden group 
                                            hover:border-${typeConfig.color}-300 hover:shadow-blue-300/30`}
                                whileHover={{scale: 1.01, y: -2}}
                            >
                                {/* Línea vertical de acento */}
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-${typeConfig.color}-500 to-cyan-500 rounded-l-xl opacity-80 group-hover:w-2 transition-all duration-300`}></div>

                                <div className="flex space-x-4 flex-1 min-w-0 items-center pl-2">
                                    {/* Icono de Tipo - Diseño 3D */}
                                    <div
                                        className={`p-3 rounded-full bg-gradient-to-br from-white to-slate-50 flex items-center justify-center 
                                                    shadow-inner shadow-slate-300/50 border border-gray-200`}>
                                        <DocIcon className={`w-6 h-6 text-${typeConfig.color}-600`}/>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* FILA 1: PACIENTE Y TIPO DE REPORTE */}
                                        <div className="flex justify-between items-center mb-1">
                                            {/* Paciente (Grande y en Negrita) */}
                                            <p className="text-lg font-extrabold text-indigo-700 leading-none">
                                                <User className="w-5 h-5 inline mr-2 align-sub"/>
                                                {doc.clinical_meta.patient_id || 'N/A'}
                                            </p>

                                            {/* Título (Tipo de Estudio) */}
                                            <h3 className="text-base font-bold text-gray-900 truncate">
                                                {doc.title}
                                            </h3>
                                        </div>

                                        {/* FILA 2: METADATOS CLAVE (CENTRADO) */}
                                        <div className="flex justify-between items-center text-sm text-gray-600 mb-2 p-1 bg-gray-100/50 rounded-lg border border-gray-200/50">
                                            <p className="flex items-center space-x-1 font-semibold text-purple-600">
                                                <Briefcase className="w-3 h-3"/>
                                                <span>{doc.clinical_meta.doctor_name || 'Desconocido'}</span>
                                            </p>
                                            <p className="flex items-center space-x-1 font-semibold text-teal-600">
                                                <Calendar className="w-3 h-3"/>
                                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                            </p>
                                            <p className="flex items-center space-x-1 font-semibold text-red-600">
                                                <AlignLeft className="w-3 h-3"/>
                                                <span className="truncate max-w-[120px]">Asunto: {doc.clinical_meta.clinical_subject || 'N/A'}</span>
                                            </p>
                                        </div>

                                        {/* FILA 3: ESTADO Y ACCIONES */}
                                        <div className="flex justify-between items-center pt-1">
                                            {/* Estado del Documento */}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColor === 'indigo' ? 'bg-indigo-500/15 text-indigo-700' : statusColor === 'emerald' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'}`}>
                                                {statusText}
                                            </span>

                                            {/* Botones de Acción Agrupados */}
                                            <div className="flex space-x-2">

                                                {/* Botón Exportar/Sincronizar (Upload) */}
                                                {!doc.is_synced && doc.is_finalized && (
                                                    <motion.button
                                                        title="Sincronizar con HIS"
                                                        className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-700 hover:text-white transition-all shadow-md hover:shadow-lg hover:bg-gradient-to-r from-indigo-500 to-purple-500"
                                                        whileHover={{scale: 1.1}}
                                                        whileTap={{scale: 0.95}}
                                                        onClick={() => handleExportToHis(doc.id, doc.title)}
                                                    >
                                                        <Upload className="w-4 h-4"/>
                                                    </motion.button>
                                                )}

                                                {/* Botón Ver/Editar */}
                                                <motion.button
                                                    title="Revisar Documento"
                                                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-100 transition-colors shadow-md hover:shadow-lg"
                                                    whileHover={{scale: 1.1}}
                                                    onClick={() => onViewDocument(doc.id)}
                                                >
                                                    <MessageSquare className="w-4 h-4"/>
                                                </motion.button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
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