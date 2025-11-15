// src/pages/Reports.jsx – LISTADO PRO / MODERNO

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    User,
    CheckCircle,
    AlertCircle,
    Radiation,
    Stethoscope,
    Pill,
    MessageSquare,
    ClipboardList,
    RotateCcw,
    Upload,
    Edit3,
    Briefcase,
    Calendar,
    AlignLeft,
    Shield,
    Database,
    Activity,
    FileCheck,
} from 'lucide-react';
import { clinicalService } from '../services/clinical';
import PaginationControls from '../components/ui/PaginationControls';

// Tipos de documento
const DOCUMENT_TYPES_MAP = {
    clinical_history: {
        label: 'Historia Clínica',
        color: 'blue',
        icon: Stethoscope,
        gradient: 'from-blue-500 to-cyan-500',
    },
    radiology_report: {
        label: 'Informe Radiológico',
        color: 'amber',
        icon: Radiation,
        gradient: 'from-amber-500 to-orange-500',
    },
    medical_prescription: {
        label: 'Fórmula Médica',
        color: 'emerald',
        icon: Pill,
        gradient: 'from-emerald-500 to-green-500',
    },
    medical_certificate: {
        label: 'Certificado Médico',
        color: 'purple',
        icon: FileText,
        gradient: 'from-purple-500 to-pink-500',
    },
    incapacity: {
        label: 'Incapacidad',
        color: 'red',
        icon: ClipboardList,
        gradient: 'from-red-500 to-pink-500',
    },
};

const PAGE_SIZE = 6;

const Reports = ({ onViewDocument, notifications }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const { success, error: notifyError, info } = notifications;

    useEffect(() => {
        // al cambiar filtros, volvemos a página 1
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadDocuments(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, filterType]);

    useEffect(() => {
        loadDocuments(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                info(
                    `Listado actualizado. ${result.total || 0} documentos encontrados.`,
                    3000
                );
            }
        } catch (err) {
            console.error('Error cargando documentos:', err);
            setError('No se pudieron cargar los reportes clínicos.');
            notifyError(
                'Error de conexión: No se pudieron cargar los reportes.',
                8000
            );
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
    };

    const handleExportToHis = async (docId, title) => {
        try {
            setLoading(true);
            info(`Iniciando exportación de "${title}"...`, 5000);
            await clinicalService.exportDocument(docId);
            await loadDocuments(false);
            success(`Documento "${title}" enviado al HIS.`, 7000);
        } catch (e) {
            notifyError(`Fallo en exportación: ${e.message}`, 8000);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalDocuments / PAGE_SIZE) || 1;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const docTypeOptions = Object.entries(DOCUMENT_TYPES_MAP).map(
        ([key, val]) => ({
            value: key,
            label: val.label,
        })
    );

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays === 1) return 'Ayer';
        return `Hace ${diffDays} días`;
    };

    const finalizedCount = documents.filter((d) => d.is_finalized).length;
    const pendingHisCount = documents.filter(
        (d) => d.is_finalized && !d.is_synced
    ).length;
    const syncedCount = documents.filter((d) => d.is_synced).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* HEADER PRINCIPAL */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-900 rounded-3xl px-6 py-6 md:px-8 md:py-7 shadow-2xl border border-slate-800/70">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                            <FileCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-[0.7rem] font-semibold tracking-[0.28em] uppercase text-cyan-200/80">
                                Monitor clínico
                            </p>
                            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Gestión de Documentos Clínicos
                            </h1>
                            <p className="mt-1 text-xs md:text-sm text-slate-200/90">
                                Revise, filtre y sincronice informes, historias y certificados
                                generados por la plataforma.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <motion.button
                            onClick={handleRefreshLoad}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-slate-50 text-xs md:text-sm font-semibold border border-slate-500/40 backdrop-blur-sm hover:bg-white/15 hover:border-slate-300/60 transition-all shadow-lg shadow-slate-900/40"
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Actualizar listado</span>
                        </motion.button>
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-300/90">
                            <Activity className="w-3.5 h-3.5 text-emerald-300" />
                            <span>
                                {totalDocuments} documento
                                {totalDocuments === 1 ? '' : 's'} encontrados
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL DE MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/70 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[0.75rem] font-semibold text-blue-900/80">
                                Total documentos
                            </p>
                            <p className="text-2xl font-bold text-blue-700">
                                {totalDocuments}
                            </p>
                        </div>
                        <Database className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/70 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[0.75rem] font-semibold text-emerald-900/80">
                                Finalizados
                            </p>
                            <p className="text-2xl font-bold text-emerald-700">
                                {finalizedCount}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[0.75rem] font-semibold text-amber-900/80">
                                Pendientes HIS
                            </p>
                            <p className="text-2xl font-bold text-amber-700">
                                {pendingHisCount}
                            </p>
                        </div>
                        <Upload className="w-8 h-8 text-amber-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/70 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[0.75rem] font-semibold text-purple-900/80">
                                Sincronizados
                            </p>
                            <p className="text-2xl font-bold text-purple-700">
                                {syncedCount}
                            </p>
                        </div>
                        <Shield className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* FILTROS */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-slate-400">
                        Filtros activos
                    </p>
                    <p className="text-[0.7rem] text-slate-400">
                        Los resultados se actualizan automáticamente
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por paciente, médico, asunto o contenido…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Tipo de documento */}
                    <div className="flex items-center gap-2">
                        <span className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                            Tipo
                        </span>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Todos los tipos</option>
                            {docTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Resumen pequeño de resultados */}
                    <div className="flex flex-col justify-center text-[0.8rem] text-slate-500">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                                {documents.length} documentos en la página actual
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            {loading ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <motion.div
                        className="w-11 h-11 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        transition={{
                            ease: 'linear',
                            duration: 1,
                            repeat: Infinity,
                        }}
                    />
                    <p className="text-slate-600 text-sm font-medium">
                        Cargando documentos clínicos…
                    </p>
                </div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50/80 border border-red-200 rounded-2xl shadow-xl">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-red-700 mb-1">
                        Error al cargar documentos
                    </h3>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <FileText className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">
                        No se encontraron documentos
                    </h3>
                    <p className="text-sm text-slate-500">
                        Ajusta los filtros o realiza una nueva búsqueda.
                    </p>
                </div>
            ) : (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.06 }}
                >
                    {documents.map((doc) => {
                        const typeConfig =
                            DOCUMENT_TYPES_MAP[doc.document_type] ||
                            DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;

                        const statusConfig = doc.is_synced
                            ? {
                                color: 'emerald',
                                text: 'Sincronizado HIS',
                                icon: CheckCircle,
                            }
                            : doc.is_finalized
                                ? {
                                    color: 'blue',
                                    text: 'Finalizado',
                                    icon: FileCheck,
                                }
                                : {
                                    color: 'amber',
                                    text: 'Borrador',
                                    icon: Edit3,
                                };

                        const StatusIcon = statusConfig.icon;
                        const createdAt = new Date(doc.created_at);

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                className="group relative"
                            >
                                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200/70 hover:shadow-xl hover:border-blue-200/70 transition-all duration-300">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Columna izquierda */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Icono tipo documento */}
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center shadow-lg`}
                                                >
                                                    <DocIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                                    <StatusIcon
                                                        className={`w-3 h-3 text-${statusConfig.color}-500`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Contenido principal */}
                                            <div className="flex-1 min-w-0 space-y-2.5">
                                                {/* Fila 1: paciente + estado + tiempo relativo */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                            <span className="text-xs font-semibold text-blue-800">
                                                                {doc.clinical_meta
                                                                        ?.patient_id ||
                                                                    'Paciente sin identificación'}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border border-${statusConfig.color}-200`}
                                                        >
                                                            {statusConfig.text}
                                                        </span>
                                                    </div>
                                                    <span className="text-[0.75rem] text-slate-500">
                                                        {getRelativeTime(doc.created_at)}
                                                    </span>
                                                </div>

                                                {/* Fila 2: título / asunto */}
                                                <div>
                                                    <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                                                        {typeConfig.label}
                                                    </p>
                                                    <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-snug line-clamp-1">
                                                        {doc.clinical_meta
                                                                ?.clinical_subject ||
                                                            doc.title ||
                                                            'Documento clínico sin asunto específico'}
                                                    </h3>
                                                </div>

                                                {/* Fila 3: metadatos */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-[0.68rem] text-slate-500 font-semibold uppercase">
                                                                Médico responsable
                                                            </p>
                                                            <p className="text-slate-900 font-medium">
                                                                {doc.clinical_meta
                                                                        ?.doctor_name ||
                                                                    'No especificado'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <AlignLeft className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-[0.68rem] text-slate-500 font-semibold uppercase">
                                                                Resumen
                                                            </p>
                                                            <p className="text-slate-900 font-medium line-clamp-1">
                                                                {doc.clinical_meta
                                                                        ?.clinical_subject ||
                                                                    'Sin descripción'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-[0.68rem] text-slate-500 font-semibold uppercase">
                                                                Fecha de creación
                                                            </p>
                                                            <p className="text-slate-900 font-medium">
                                                                {createdAt.toLocaleDateString(
                                                                    'es-ES',
                                                                    {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric',
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna derecha: acciones */}
                                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                            <motion.button
                                                onClick={() => onViewDocument(doc.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-slate-50 text-xs font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Revisar</span>
                                            </motion.button>

                                            {!doc.is_synced && doc.is_finalized && (
                                                <motion.button
                                                    onClick={() =>
                                                        handleExportToHis(
                                                            doc.id,
                                                            doc.title
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 text-[0.75rem] font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.96 }}
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Exportar HIS</span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer sutil con ID y hora */}
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem] text-slate-500">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span
                                            className="font-mono"
                                            title={doc.id}
                                        >
                                            ID: {doc.id}
                                        </span>
                                        <span className="mx-1">•</span>
                                        <span>
                                            Generado a las{' '}
                                            {createdAt.toLocaleTimeString(
                                                'es-ES',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* PAGINACIÓN */}
            {!loading && totalPages > 1 && (
                <div className="mt-6">
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
