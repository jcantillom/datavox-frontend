import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
    FileText, Search, User, Clock, CheckCircle, AlertCircle, Radiation,
    Stethoscope, Pill, Download, MessageSquare, ClipboardList, RotateCcw,
    Upload, Edit3, Briefcase, Calendar, AlignLeft, Send, Check,
    Shield, Zap, FileCheck, Database, Activity
} from 'lucide-react';
import {clinicalService} from '../services/clinical';
import PaginationControls from '../components/ui/PaginationControls';

// Definición de tipos de documentos (para color y mapeo)
const DOCUMENT_TYPES_MAP = {
    clinical_history: {label: 'Historia Clínica', color: 'blue', icon: Stethoscope, gradient: 'from-blue-500 to-cyan-500'},
    radiology_report: {label: 'Informe Radiológico', color: 'amber', icon: Radiation, gradient: 'from-amber-500 to-orange-500'},
    medical_prescription: {label: 'Fórmula Médica', color: 'emerald', icon: Pill, gradient: 'from-emerald-500 to-green-500'},
    medical_certificate: {label: 'Certificado Médico', color: 'purple', icon: FileText, gradient: 'from-purple-500 to-pink-500'},
    incapacity: {label: 'Incapacidad', color: 'red', icon: ClipboardList, gradient: 'from-red-500 to-pink-500'}
};

const PAGE_SIZE = 6;

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
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadDocuments(false);
        }
    }, [searchQuery, filterType]);

    useEffect(() => {
        loadDocuments(false);
    }, [currentPage]);

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
                info(`Listado actualizado. ${result.total} documentos encontrados.`, 3000);
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
            await clinicalService.exportDocument(docId);
            loadDocuments(false);
            success(`Documento "${title}" enviado al HIS.`, 7000);
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

    // Función para formatear fecha relativa
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `Hace ${diffMins} min`;
        } else if (diffHours < 24) {
            return `Hace ${diffHours} h`;
        } else if (diffDays === 1) {
            return 'Ayer';
        } else {
            return `Hace ${diffDays} días`;
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            {/* Header Principal */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Documentos Clínicos</h1>
                            <p className="text-blue-200 text-lg">Revise y administre todos los documentos médicos generados</p>
                        </div>
                    </div>
                    <motion.button
                        onClick={handleRefreshLoad}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 border border-white/20"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Actualizar</span>
                    </motion.button>
                </div>
            </div>

            {/* Panel de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">Total Documentos</p>
                            <p className="text-2xl font-bold text-blue-700">{totalDocuments}</p>
                        </div>
                        <Database className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-emerald-900">Finalizados</p>
                            <p className="text-2xl font-bold text-emerald-700">
                                {documents.filter(d => d.is_finalized).length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-amber-900">Pendientes HIS</p>
                            <p className="text-2xl font-bold text-amber-700">
                                {documents.filter(d => d.is_finalized && !d.is_synced).length}
                            </p>
                        </div>
                        <Upload className="w-8 h-8 text-amber-500" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-purple-900">Sincronizados</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {documents.filter(d => d.is_synced).length}
                            </p>
                        </div>
                        <Shield className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por paciente, médico o contenido..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-300"
                    >
                        <option value="">Todos los tipos de documento</option>
                        {docTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <motion.button
                        onClick={handleRefreshLoad}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        Aplicar Filtros
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <motion.div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        transition={{ease: "linear", duration: 1, repeat: Infinity}}
                    />
                    <p className="text-gray-600 font-medium">Cargando documentos clínicos...</p>
                </div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Error al cargar documentos</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron documentos</h3>
                    <p className="text-gray-500">No hay documentos que coincidan con los filtros aplicados.</p>
                </div>
            ) : (
                <motion.div
                    className="space-y-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{staggerChildren: 0.1}}
                >
                    {documents.map((doc) => {
                        const typeConfig = DOCUMENT_TYPES_MAP[doc.document_type] || DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;

                        const statusConfig = doc.is_synced
                            ? {color: 'emerald', text: 'Sincronizado', icon: CheckCircle}
                            : doc.is_finalized
                                ? {color: 'blue', text: 'Finalizado', icon: FileCheck}
                                : {color: 'amber', text: 'Borrador', icon: Edit3};

                        const StatusIcon = statusConfig.icon;

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                className="group relative"
                            >
                                {/* Tarjeta Principal */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:border-blue-200/50">
                                    <div className="flex items-start justify-between">
                                        {/* Columna Izquierda - Información Principal */}
                                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                                            {/* Icono de Tipo con Gradiente */}
                                            <div className={`relative flex-shrink-0`}>
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center shadow-lg`}>
                                                    <DocIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center">
                                                    <StatusIcon className={`w-3 h-3 text-${statusConfig.color}-500`} />
                                                </div>
                                            </div>

                                            {/* Contenido Principal */}
                                            <div className="flex-1 min-w-0 space-y-3">
                                                {/* Línea 1: Paciente + Estado */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                            <span className="text-sm font-bold text-blue-700">
                                                                {doc.clinical_meta.patient_id || 'Paciente no identificado'}
                                                            </span>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border border-${statusConfig.color}-200`}>
                                                            {statusConfig.text}
                                                        </span>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-500">
                                                        {getRelativeTime(doc.created_at)}
                                                    </div>
                                                </div>

                                                {/* Línea 2: Título del Documento */}
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    {typeConfig.label}
                                                </h3>

                                                {/* Línea 3: Metadatos */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-semibold">MÉDICO</p>
                                                            <p className="text-gray-900 font-medium">{doc.clinical_meta.doctor_name || 'No especificado'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <AlignLeft className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-semibold">ASUNTO</p>
                                                            <p className="text-gray-900 font-medium truncate">
                                                                {doc.clinical_meta.clinical_subject || 'Sin asunto específico'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-semibold">FECHA</p>
                                                            <p className="text-gray-900 font-medium">
                                                                {new Date(doc.created_at).toLocaleDateString('es-ES', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha - Acciones */}
                                        <div className="flex flex-col items-end space-y-3 ml-4 flex-shrink-0">
                                            {/* Botón Principal - Ver/Editar */}
                                            <motion.button
                                                onClick={() => onViewDocument(doc.id)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                                                whileHover={{scale: 1.05}}
                                                whileTap={{scale: 0.95}}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span className="text-sm">Revisar</span>
                                            </motion.button>

                                            {/* Botón Secundario - Exportar */}
                                            {!doc.is_synced && doc.is_finalized && (
                                                <motion.button
                                                    onClick={() => handleExportToHis(doc.id, doc.title)}
                                                    className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 text-sm"
                                                    whileHover={{scale: 1.05}}
                                                    whileTap={{scale: 0.95}}
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Exportar HIS</span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Barra de Progreso Sutil */}
                                    <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
                                        <Activity className="w-3 h-3" />
                                        <span>Documento ID: {doc.id.substring(0, 8)}...</span>
                                        <span className="mx-2">•</span>
                                        <span>Generado: {new Date(doc.created_at).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Paginación */}
            {!loading && totalPages > 1 && (
                <div className="mt-8">
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