// src/pages/Reports.jsx – LISTADO MODERNO DE REPORTES CLÍNICOS

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Search, User, AlertCircle, Radiation,
    Stethoscope, Pill, ClipboardList, RotateCcw,
    Upload, Briefcase, Calendar, AlignLeft, MessageSquare
} from 'lucide-react';

import { clinicalService } from '../services/clinical';
import PaginationControls from '../components/ui/PaginationControls';

// Tipos de documentos (label, color e ícono)
const DOCUMENT_TYPES_MAP = {
    clinical_history: { label: 'Historia Clínica', color: 'indigo', icon: Stethoscope },
    radiology_report: { label: 'Informe Radiológico', color: 'amber', icon: Radiation },
    medical_prescription: { label: 'Fórmula Médica', color: 'emerald', icon: Pill },
    medical_certificate: { label: 'Certificado Médico', color: 'purple', icon: FileText },
    incapacity: { label: 'Incapacidad', color: 'red', icon: ClipboardList }
};

const PAGE_SIZE = 6;

const Reports = ({ onViewDocument, notifications, tenantMetadata }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const { success, error: notifyError, info } = notifications;

    // Recargar cuando cambie búsqueda o filtro
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadDocuments(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, filterType]);

    // Recargar al cambiar de página
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
                info(
                    `Listado de reportes actualizado. ${result.total || 0} documentos encontrados.`,
                    3000
                );
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

            // Volvemos a cargar para reflejar el estado actualizado
            loadDocuments(false);

            success(`Documento "${title}" enviado al HIS (Proceso asíncrono iniciado).`, 7000);
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

    const docTypeOptions = Object.entries(DOCUMENT_TYPES_MAP).map(([key, val]) => ({
        value: key,
        label: val.label
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* HEADER SUPERIOR */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/80 backdrop-blur-md px-6 py-5 rounded-3xl shadow-lg border border-slate-200/60">
                <div>
                    <h2 className="text-[1.6rem] font-extrabold text-slate-900 tracking-tight">
                        Reportes y Documentación
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Vista consolidada de los documentos generados por la plataforma.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        <FileText className="h-3.5 w-3.5 text-indigo-500" />
                        {totalDocuments} documento{totalDocuments === 1 ? '' : 's'}
                    </span>

                    <motion.button
                        onClick={handleRefreshLoad}
                        className="p-2.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        title="Actualizar listado"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* BUSCADOR + FILTRO */}
            <div className="grid gap-4 rounded-2xl bg-gradient-to-br from-white via-blue-50/70 to-slate-50 px-4 py-4 shadow-inner border border-slate-100">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Buscador */}
                    <div className="relative w-full md:max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por paciente, asunto o contenido clínico..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                    </div>

                    {/* Filtro por tipo de documento */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Tipo de documento:
                        </span>

                        <button
                            type="button"
                            onClick={() => setFilterType('')}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold border text-slate-600 transition-all ${
                                filterType === ''
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            Todos
                        </button>

                        {docTypeOptions.map((opt) => {
                            const cfg = DOCUMENT_TYPES_MAP[opt.value];
                            const Icon = cfg.icon;
                            const isActive = filterType === opt.value;

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFilterType(opt.value)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                                        isActive
                                            ? `bg-${cfg.color}-600 text-white border-${cfg.color}-600 shadow-sm`
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            {loading ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-lg text-slate-600">
                    Cargando reportes clínicos...
                </div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50/80 border border-red-200 rounded-2xl shadow-lg text-red-700 font-semibold">
                    <AlertCircle className="w-6 h-6 mx-auto mb-3" />
                    {error}
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-10 bg-white/80 rounded-2xl shadow-lg text-slate-500">
                    No se encontraron documentos con los filtros actuales.
                </div>
            ) : (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                >
                    {documents.map((doc) => {
                        const typeConfig =
                            DOCUMENT_TYPES_MAP[doc.document_type] ||
                            DOCUMENT_TYPES_MAP.clinical_history;
                        const DocIcon = typeConfig.icon;

                        const statusColor = doc.is_synced
                            ? 'emerald'
                            : doc.is_finalized
                                ? 'indigo'
                                : 'amber';

                        const statusText = doc.is_synced
                            ? 'Sincronizado con HIS'
                            : doc.is_finalized
                                ? 'Finalizado (Pend. HIS)'
                                : 'Borrador en edición';

                        const patientId = doc.clinical_meta?.patient_id || 'N/A';
                        const doctorName = doc.clinical_meta?.doctor_name || 'Desconocido';
                        const subject = doc.clinical_meta?.clinical_subject || 'Sin asunto definido';

                        return (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                className={`
                                    relative overflow-hidden rounded-2xl border bg-white/95
                                    shadow-sm hover:shadow-2xl transition-all duration-300
                                    border-slate-100 hover:border-${typeConfig.color}-300
                                `}
                            >
                                {/* Barra de acento izquierda */}
                                <div
                                    className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-${typeConfig.color}-500 via-${typeConfig.color}-400 to-cyan-400`}
                                />

                                <div className="flex flex-col gap-3 px-5 py-4 pl-6 md:flex-row md:items-start md:justify-between">
                                    {/* Columna izquierda: tipo, paciente, asunto */}
                                    <div className="flex flex-1 min-w-0 gap-4">
                                        {/* Icono tipo documento */}
                                        <div
                                            className={`
                                                mt-1 flex h-12 w-12 items-center justify-center rounded-2xl
                                                bg-gradient-to-br from-${typeConfig.color}-50 to-slate-50
                                                border border-${typeConfig.color}-100 shadow-inner
                                            `}
                                        >
                                            <DocIcon
                                                className={`h-6 w-6 text-${typeConfig.color}-600`}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            {/* NIVEL 1 – Paciente (información clave) */}
                                            <p className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" />
                                                <span>Paciente ID:</span>
                                                <span className="font-mono text-[0.85rem]">
                                                    {patientId}
                                                </span>
                                            </p>

                                            {/* NIVEL 2 – Tipo de documento + título/estudio */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`
                                                        inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.68rem]
                                                        font-semibold uppercase tracking-[0.18em]
                                                        bg-${typeConfig.color}-50 text-${typeConfig.color}-700 border border-${typeConfig.color}-100
                                                    `}
                                                >
                                                    {typeConfig.label}
                                                </span>

                                                <span className="text-[0.8rem] font-semibold text-slate-800 truncate max-w-full">
                                                    {subject}
                                                </span>
                                            </div>

                                            {/* NIVEL 3 – Doctor, ID documento y resumen fecha */}
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                                                    <span className="font-semibold">
                                                        {doctorName}
                                                    </span>
                                                </span>

                                                <span className="hidden text-slate-300 md:inline">•</span>

                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="font-mono text-[0.7rem]">
                                                        ID: {doc.id}
                                                    </span>
                                                </span>

                                                <span className="hidden text-slate-300 md:inline">•</span>

                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5 text-teal-500" />
                                                    <span>
                                                        {new Date(
                                                            doc.created_at
                                                        ).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit'
                                                        })}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna derecha: estado + acciones */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        {/* Estado */}
                                        <span
                                            className={`
                                                inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem]
                                                font-semibold shadow-sm
                                                ${
                                                statusColor === 'emerald'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : statusColor === 'indigo'
                                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }
                                            `}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {statusText}
                                        </span>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2">
                                            {/* Ver / Revisar */}
                                            <motion.button
                                                type="button"
                                                title="Revisar documento"
                                                onClick={() => onViewDocument(doc.id)}
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:shadow-lg hover:bg-slate-800 transition-all"
                                                whileHover={{ scale: 1.06 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </motion.button>

                                            {/* Exportar a HIS */}
                                            {!doc.is_synced && doc.is_finalized && (
                                                <motion.button
                                                    type="button"
                                                    title="Exportar / Sincronizar con HIS"
                                                    onClick={() =>
                                                        handleExportToHis(doc.id, subject)
                                                    }
                                                    className={`
                                                        flex h-9 w-9 items-center justify-center rounded-full
                                                        bg-gradient-to-br from-indigo-500 to-sky-500 text-white
                                                        shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-sky-600
                                                        transition-all
                                                    `}
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* PAGINACIÓN */}
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
