// src/pages/Reports.jsx – LISTADO CLÍNICO MODERNO (AJUSTADO)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Search, User, CheckCircle, AlertCircle, Radiation,
    Stethoscope, Pill, MessageSquare, ClipboardList, RotateCcw,
    Upload, Edit3, Briefcase, Calendar, AlignLeft,
    Shield, FileCheck, Database, Activity
} from 'lucide-react';
import { clinicalService } from '../services/clinical';
import PaginationControls from '../components/ui/PaginationControls';

const DOCUMENT_TYPES_MAP = {
    clinical_history: {
        label: 'Historia Clínica',
        color: 'blue',
        icon: Stethoscope,
        gradient: 'from-blue-500 to-cyan-500'
    },
    radiology_report: {
        label: 'Informe Radiológico',
        color: 'amber',
        icon: Radiation,
        gradient: 'from-amber-500 to-orange-500'
    },
    medical_prescription: {
        label: 'Fórmula Médica',
        color: 'emerald',
        icon: Pill,
        gradient: 'from-emerald-500 to-green-500'
    },
    medical_certificate: {
        label: 'Certificado Médico',
        color: 'purple',
        icon: FileText,
        gradient: 'from-purple-500 to-pink-500'
    },
    incapacity: {
        label: 'Incapacidad',
        color: 'red',
        icon: ClipboardList,
        gradient: 'from-red-500 to-pink-500'
    }
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
                pageSize: PAGE_SIZE
            };

            const result = await clinicalService.listDocuments(filters);
            setDocuments(result.data || []);
            setTotalDocuments(result.total || 0);

            if (notifyOnComplete) {
                info(`Listado actualizado. ${result.total} documentos encontrados.`, 3000);
            }
        } catch (err) {
            console.error('Error cargando documentos:', err);
            setError('No se pudieron cargar los reportes clínicos.');
            notifyError('Error de conexión: No se pudieron cargar los reportes.', 8000);
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
            loadDocuments(false);
            success(`Documento "${title}" enviado al HIS.`, 7000);
        } catch (e) {
            notifyError(`Fallo en exportación: ${e.message}`, 8000);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalDocuments / PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const docTypeOptions = Object.entries(DOCUMENT_TYPES_MAP).map(([key, val]) => ({
        value: key,
        label: val.label
    }));

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

    const finalizedCount = documents.filter(d => d.is_finalized).length;
    const syncedCount = documents.filter(d => d.is_synced).length;
    const pendingHisCount = documents.filter(d => d.is_finalized && !d.is_synced).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* HEADER CLÍNICO con gradiente más dinámico */}
            <div className="relative rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-blue-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-blue-100 to-cyan-50" />
                <div className="relative z-10 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <FileCheck className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-slate-500 mb-1">
                                    Monitor clínico
                                </p>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                                    Gestión de Documentos Clínicos
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Revise, filtre y sincronice informes, historias y certificados generados en la plataforma.
                                </p>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleRefreshLoad}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/80 text-slate-900 rounded-xl text-sm font-semibold border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Actualizar listado</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* PANEL DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-blue-900">Total documentos</p>
                            <p className="text-2xl font-bold text-blue-700">{totalDocuments}</p>
                        </div>
                        <Database className="w-7 h-7 text-blue-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-emerald-900">Finalizados</p>
                            <p className="text-2xl font-bold text-emerald-700">{finalizedCount}</p>
                        </div>
                        <CheckCircle className="w-7 h-7 text-emerald-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-amber-900">Pendientes HIS</p>
                            <p className="text-2xl font-bold text-amber-700">{pendingHisCount}</p>
                        </div>
                        <Upload className="w-7 h-7 text-amber-500" />
                    </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-purple-900">Sincronizados</p>
                            <p className="text-2xl font-bold text-purple-700">{syncedCount}</p>
                        </div>
                        <Shield className="w-7 h-7 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* FILTROS */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    <div className="relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por paciente, médico, asunto o contenido..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="">Todos los tipos de documento</option>
                        {docTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <p className="text-xs text-right text-slate-500 hidden lg:block">
                        Los resultados se actualizan automáticamente al escribir o cambiar filtros.
                    </p>
                </div>
            </div>

            {/* CONTENIDO */}
            {loading ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <motion.div
                        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        transition={{ ease: 'linear', duration: 1, repeat: Infinity }}
                    />
                    <p className="text-slate-600 font-medium">Cargando documentos clínicos...</p>
                </div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50/80 border border-red-200 rounded-2xl shadow-xl">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-700 mb-1">Error al cargar documentos</h3>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-12 bg-white/80 rounded-2xl shadow-xl">
                    <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">
                        No se encontraron documentos
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Ajusta los filtros o prueba con otro término de búsqueda.
                    </p>
                </div>
            ) : (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.08 }}
                >
                    {documents.map((doc) => {
                        const typeConfig =
                            DOCUMENT_TYPES_MAP[doc.document_type] ||
                            DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;

                        const statusConfig = doc.is_synced
                            ? { color: 'emerald', text: 'Sincronizado HIS', icon: CheckCircle }
                            : doc.is_finalized
                                ? { color: 'blue', text: 'Finalizado', icon: FileCheck }
                                : { color: 'amber', text: 'Borrador', icon: Edit3 };

                        const StatusIcon = statusConfig.icon;

                        const patientId = doc.clinical_meta?.patient_id || 'ID no disponible';
                        const patientName =
                            doc.clinical_meta?.patient_name ||
                            doc.clinical_meta?.patient_full_name ||
                            '';

                        const patientLabel = patientName
                            ? `${patientName} / ${patientId}`
                            : patientId;

                        const typeLabel = typeConfig.label;
                        const subject =
                            doc.clinical_meta?.clinical_subject ||
                            doc.title ||
                            '';

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/60 hover:border-blue-200/70 hover:shadow-xl transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        {/* IZQUIERDA: icono + info principal */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center shadow-lg`}
                                                >
                                                    <DocIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-white flex items-center justify-center shadow-sm">
                                                    <StatusIcon
                                                        className={`w-3 h-3 text-${statusConfig.color}-500`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-2">
                                                {/* Paciente + Estado */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                        <span className="text-xs font-semibold text-blue-800 truncate max-w-[260px] md:max-w-xs">
                                                            {patientLabel}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border border-${statusConfig.color}-200`}
                                                    >
                                                        {statusConfig.text}
                                                    </span>
                                                </div>

                                                {/* Título grande = TIPO DOCUMENTO */}
                                                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug truncate">
                                                    {typeLabel}
                                                </h3>

                                                {/* Metadatos en 3 columnas:
                                                    1. Médico
                                                    2. Asunto (centrado visualmente)
                                                    3. Fecha (centrado) */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-[0.78rem] mt-1">
                                                    {/* Médico */}
                                                    <div className="flex items-start gap-2">
                                                        <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0 mt-[2px]" />
                                                        <div>
                                                            <p className="text-[0.65rem] font-semibold text-slate-500">
                                                                MÉDICO RESPONSABLE
                                                            </p>
                                                            <p className="text-slate-900 font-medium">
                                                                {doc.clinical_meta?.doctor_name ||
                                                                    'No especificado'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Asunto en la columna central */}
                                                    <div className="flex items-start gap-2 md:justify-center">
                                                        <AlignLeft className="w-4 h-4 text-orange-500 flex-shrink-0 mt-[2px]" />
                                                        <div className="md:text-center">
                                                            <p className="text-[0.65rem] font-semibold text-slate-500">
                                                                ASUNTO
                                                            </p>
                                                            <p className="text-slate-900 font-medium line-clamp-2">
                                                                {subject || 'Sin asunto específico'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Fecha, más centrada */}
                                                    <div className="flex items-start gap-2 md:justify-center">
                                                        <Calendar className="w-4 h-4 text-teal-500 flex-shrink-0 mt-[2px]" />
                                                        <div className="md:text-center">
                                                            <p className="text-[0.65rem] font-semibold text-slate-500">
                                                                FECHA DE CREACIÓN
                                                            </p>
                                                            <p className="text-slate-900 font-medium">
                                                                {new Date(
                                                                    doc.created_at
                                                                ).toLocaleDateString('es-ES', {
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

                                        {/* DERECHA: tiempo + acciones */}
                                        <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-3 flex-shrink-0">
                                            <span className="text-[0.75rem] text-slate-400">
                                                {getRelativeTime(doc.created_at)}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    onClick={() => onViewDocument(doc.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-slate-800 transition-all duration-200"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.96 }}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>Revisar</span>
                                                </motion.button>

                                                {!doc.is_synced && doc.is_finalized && (
                                                    <motion.button
                                                        onClick={() =>
                                                            handleExportToHis(doc.id, subject || typeLabel)
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 transition-all duration-200"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.96 }}
                                                    >
                                                        <Upload className="w-3.5 h-3.5" />
                                                        <span>Exportar HIS</span>
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PIE: ID + HORA */}
                                    <div className="mt-4 pt-3 border-top border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-slate-500 border-t">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Activity className="w-3.5 h-3.5" />
                                            <span className="font-mono truncate max-w-xs">
                                                ID: {doc.id}
                                            </span>
                                        </div>
                                        <span>
                                            Generado a las{' '}
                                            {new Date(doc.created_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

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
