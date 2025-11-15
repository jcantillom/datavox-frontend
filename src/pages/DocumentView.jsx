// src/pages/DocumentView.jsx - VERSIÓN MEJORADA MODERNA + PDF ORDENADO

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Edit3, Save, FileText, CheckCircle, Upload,
    AlertCircle, Download, Stethoscope,
    Pill, Radiation, RefreshCcw,
    Mail, Briefcase, Scan, UserCheck, ClipboardList,
    ShieldCheck, Activity, Calendar, User, AlignLeft
} from 'lucide-react';

import { clinicalService } from '../services/clinical';
import MembreteHeader from '../components/ui/MembreteHeader';

const DOCUMENT_TYPES_MAP = {
    clinical_history: { label: 'HISTORIA CLÍNICA', color: 'blue', icon: Stethoscope, dual_icon: ClipboardList },
    radiology_report: { label: 'INFORME RADIOLÓGICO', color: 'amber', icon: Radiation, dual_icon: Scan },
    medical_prescription: { label: 'FÓRMULA MÉDICA', color: 'emerald', icon: Pill, dual_icon: Pill },
    medical_certificate: { label: 'CERTIFICADO MÉDICO', color: 'purple', icon: FileText, dual_icon: ShieldCheck },
    incapacity: { label: 'INCAPACIDAD', color: 'red', icon: FileText, dual_icon: UserCheck }
};

const DocumentView = ({ documentId, onBack, notifications, tenantMetadata }) => {
    const [documentData, setDocumentData] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const { success, error: notifyError, info } = notifications;

    const docConfig = documentData
        ? DOCUMENT_TYPES_MAP[documentData.document_type] || DOCUMENT_TYPES_MAP.clinical_history
        : DOCUMENT_TYPES_MAP.clinical_history;

    const DocIcon = docConfig.icon;

    useEffect(() => {
        if (documentId) {
            loadDocument();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId]);

    const loadDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const doc = await clinicalService.getDocumentById(documentId);
            setDocumentData(doc);
            setContent(doc.content);
        } catch (err) {
            console.error('Error cargando documento:', err);
            setError(err.message || 'No se pudo cargar el documento.');
            notifyError(
                `Error cargando documento ID ${documentId.substring(0, 8)}...: ${err.message}`,
                8000
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (isFinalizing = false) => {
        setIsSaving(true);
        setError(null);
        try {
            const updatedDoc = await clinicalService.updateDocumentContent(
                documentId,
                content,
                isFinalizing
            );

            setDocumentData(updatedDoc);
            setIsEditing(false);

            if (isFinalizing) {
                success('Documento Finalizado y Aprobado. Listo para exportación.', 7000);
            } else {
                success('Borrador guardado exitosamente.', 5000);
            }
        } catch (err) {
            setError(err.message || 'Error al guardar el documento.');
            notifyError(`Error al guardar cambios: ${err.message}`, 8000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!documentData.is_finalized) {
            notifications.warning(
                'Acción Requerida: Debe finalizar el documento antes de exportar a HIS.',
                6000
            );
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            info(
                'Sincronización Iniciada: El documento está siendo procesado para el HIS (Asíncrono).',
                7000
            );
            const exportedDoc = await clinicalService.exportDocument(documentId);

            setDocumentData(exportedDoc);

            success('Exportación a HIS disparada con éxito.', 7000);
        } catch (e) {
            setError(e.message || 'Error al disparar la exportación.');
            notifyError(`Fallo en la exportación: ${e.message}`, 8000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!documentData.is_finalized) {
            notifications.warning(
                'Debe Finalizar el documento para descargar la versión oficial.',
                6000
            );
            return;
        }

        const patientId =
            documentData.clinical_meta?.patient_id?.replace(/[^a-zA-Z0-9-]/g, '_') || 'Paciente_ID';
        const subject =
            documentData.clinical_meta?.clinical_subject?.replace(/[^a-zA-Z0-9-]/g, '_') ||
            'Informe';
        const docTypeLabel = docConfig.label.replace(/[^a-zA-Z0-9-]/g, '');

        const filename = `${patientId}-${subject}-${docTypeLabel}.pdf`;

        document.title = filename;
        window.print();

        setTimeout(() => {
            document.title = 'DataVoxMedical | Revisión Documento';
        }, 500);

        notifications.info(
            "Abriendo diálogo de impresión. Seleccione 'Guardar como PDF'.",
            5000
        );
    };

    const getCleanContent = () => {
        if (!documentData || !documentData.content) return '';

        let cleanContent = documentData.content;

        const footerRegex = /--- FIN DEL INFORME ---[\s\S]*$/g;
        cleanContent = cleanContent.replace(footerRegex, '');

        const headerRegex = /--- INFORME MÉDICO OFICIAL ---[\s\S]*?---/g;
        cleanContent = cleanContent.replace(headerRegex, '');

        return cleanContent.trim();
    };

    const getPrintPatientData = () => {
        const patientId = documentData.clinical_meta?.patient_id || 'N/A';
        const doctorName = documentData.clinical_meta?.doctor_name || 'N/A';
        const subject = documentData.clinical_meta?.clinical_subject || 'N/A';
        const date = new Date(documentData.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return (
            <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-800 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p>
                    <User className="inline-block w-4 h-4 mr-2 align-middle text-blue-600" />
                    <span className="font-semibold">Paciente ID:</span> {patientId}
                </p>
                <p className="text-right">
                    <Stethoscope className="inline-block w-4 h-4 mr-2 align-middle text-blue-600" />
                    <span className="font-semibold">Médico:</span> {doctorName}
                </p>
                <p>
                    <AlignLeft className="inline-block w-4 h-4 mr-2 align-middle text-blue-600" />
                    <span className="font-semibold">Asunto:</span> {subject}
                </p>
                <p className="text-right">
                    <Calendar className="inline-block w-4 h-4 mr-2 align-middle text-blue-600" />
                    <span className="font-semibold">Fecha:</span> {date}
                </p>
            </div>
        );
    };

    const getPrintFooter = () => {
        const legalId = tenantMetadata?.meta?.legal_id || 'N/A';
        const institutionName = tenantMetadata?.name || 'Institución Médica';

        return (
            <div className="print-footer text-center text-xs text-slate-600 mt-8 pt-4 border-t border-slate-300">
                <p className="font-semibold text-slate-800">{institutionName}</p>
                <p className="mt-1 flex items-center justify-center">
                    <Mail className="inline-block w-3 h-3 mr-1 align-middle" /> contact@datavox.com
                    <span className="mx-2">|</span>
                    <Briefcase className="inline-block w-3 h-3 mr-1 align-middle" /> {legalId}
                </p>
                <p className="mt-2 text-slate-500">
                    Plataforma Inteligente de Salud potenciada por DataVoxMedical
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center p-10 bg-white rounded-2xl shadow-lg text-slate-600 border border-slate-200">
                <motion.div
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                    transition={{ ease: 'linear', duration: 1, repeat: Infinity }}
                ></motion.div>
                Cargando documento clínico...
            </div>
        );
    }

    if (error && !documentData) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-2xl shadow-lg text-red-700 font-semibold">
                <AlertCircle className="w-6 h-6 mx-auto mb-3" />
                {error}
                <motion.button
                    onClick={onBack}
                    className="mt-4 text-blue-600 font-semibold flex items-center mx-auto"
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Reportes
                </motion.button>
            </div>
        );
    }

    const isDocumentFinalized = documentData?.is_finalized;
    const isDocumentSynced = documentData?.is_synced;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* Control Bar (Ocultar al imprimir) */}
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border border-slate-200/60 print:hidden">
                <h2 className="text-[1.55rem] font-bold text-slate-900 flex items-center space-x-3">
                    <DocIcon className={`w-7 h-7 text-${docConfig.color}-600`} />
                    <span>{docConfig.label} - Revisión Final</span>
                </h2>
                <motion.button
                    onClick={onBack}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700/5 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-700/10 transition-all"
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a Listado</span>
                </motion.button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2 print:hidden">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Contenido Principal */}
            <div
                className="
                    bg-gradient-to-b from-white via-slate-50/90 to-slate-100
                    rounded-3xl px-5 pt-4 pb-6
                    shadow-[0_22px_55px_rgba(15,23,42,0.15)]
                    border border-slate-200/70
                    print:shadow-none print:p-0 print:border-none print:bg-white
                "
            >
                {/* Membrete VISUAL (Solo para vista de edición) */}
                <div className="print:hidden">
                    <MembreteHeader tenantMetadata={tenantMetadata} isPrintMode={false} />
                </div>

                <div className="px-5 pb-4 pt-0 print:p-0 print:m-0">
                    {/* Bloque de Metadata (OCULTAR para impresión) */}
                    <div className="mb-5 pb-5 border-b border-slate-200 print:hidden">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                            {/* Tipo de documento */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        flex h-10 w-10 items-center justify-center rounded-2xl
                                        bg-${docConfig.color}-50 text-${docConfig.color}-600
                                    `}
                                >
                                    <DocIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-400">
                                        Documento clínico
                                    </p>
                                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                                        {docConfig.label}
                                    </h1>
                                    <p className="mt-0.5 text-[0.7rem] text-slate-500">
                                        ID documento:&nbsp;
                                        <span className="font-mono text-slate-700">
                                            {documentId?.substring(0, 12)}…
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Estado + fecha */}
                            <div className="flex flex-col items-end gap-1.5">
                                <span
                                    className={`
                                        inline-flex items-center gap-1.5 rounded-full border px-3 py-1
                                        text-[0.7rem] font-semibold
                                        ${
                                        isDocumentSynced
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : isDocumentFinalized
                                                ? 'border-sky-200 bg-sky-50 text-sky-700'
                                                : 'border-amber-200 bg-amber-50 text-amber-700'
                                    }
                                    `}
                                >
                                    <Activity className="h-3 w-3" />
                                    {isDocumentSynced
                                        ? 'SINCRONIZADO CON HIS'
                                        : isDocumentFinalized
                                            ? 'FINALIZADO · PENDIENTE HIS'
                                            : 'BORRADOR EN EDICIÓN'}
                                </span>

                                <p className="text-[0.7rem] text-slate-500">
                                    Creado el{' '}
                                    {new Date(documentData.created_at).toLocaleString('es-ES', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Tarjeta con meta clínica */}
                        <div className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-[0.8rem] text-slate-700 md:grid-cols-4">
                            <div>
                                <p className="text-[0.63rem] font-semibold uppercase tracking-wide text-slate-400">
                                    Paciente / ID
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 font-semibold">
                                    <User className="h-3.5 w-3.5 text-blue-600" />
                                    {documentData.clinical_meta?.patient_id || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[0.63rem] font-semibold uppercase tracking-wide text-slate-400">
                                    Médico responsable
                                </p>
                                <p className="mt-0.5 flex items-center gap-1">
                                    <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                                    {documentData.clinical_meta?.doctor_name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[0.63rem] font-semibold uppercase tracking-wide text-slate-400">
                                    Asunto / estudio
                                </p>
                                <p className="mt-0.5 flex items-center gap-1">
                                    <AlignLeft className="h-3.5 w-3.5 text-blue-600" />
                                    {documentData.clinical_meta?.clinical_subject || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[0.63rem] font-semibold uppercase tracking-wide text-slate-400">
                                    Fecha del informe
                                </p>
                                <p className="mt-0.5 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                    {new Date(documentData.created_at).toLocaleDateString(
                                        'es-ES',
                                        { year: 'numeric', month: '2-digit', day: '2-digit' }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Área de Contenido (Texto del informe) */}
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-96 p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none text-sm font-mono bg-white"
                            placeholder="Edite el contenido del documento médico..."
                            disabled={isSaving}
                        />
                    ) : (
                        <div
                            className="
                                w-full rounded-2xl border border-blue-100
                                bg-blue-50/80
                                px-5 py-4
                                text-slate-800 text-sm
                                whitespace-pre-wrap
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                                print:shadow-none print:bg-transparent print:border-none print:p-0 print:text-black print:whitespace-pre-line
                            "
                        >
                            {/* --- CONTENIDO PARA IMPRESIÓN (PDF) --- */}
                            <div className="hidden print:block">
                                <div className="max-w-3xl mx-auto pt-4 pb-8 px-6">
                                    {/* Membrete para PDF */}
                                    <MembreteHeader
                                        tenantMetadata={tenantMetadata}
                                        isPrintMode={true}
                                    />

                                    {/* Encabezado tipo de documento + paciente */}
                                    <div className="text-left mb-6 mt-4">
                                        <p className="text-xs font-semibold tracking-[0.26em] text-slate-500 uppercase mb-1">
                                            Documento clínico
                                        </p>
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center rounded-xl shadow-md">
                                                {React.createElement(docConfig.dual_icon, {
                                                    className: 'w-6 h-6 text-white'
                                                })}
                                            </div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                                {docConfig.label}
                                            </h1>
                                        </div>

                                        {getPrintPatientData()}
                                    </div>

                                    {/* Cuerpo del informe */}
                                    <div className="mt-5 text-[0.9rem] leading-relaxed text-slate-900">
                                        {getCleanContent()}
                                    </div>

                                    {/* Pie de página */}
                                    {getPrintFooter()}
                                </div>
                            </div>

                            {/* Contenido para la vista normal (no impresión) */}
                            <div className="print:hidden bg-white p-4 rounded border border-slate-200">
                                {getCleanContent()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones de Acción (Ocultar al imprimir) */}
                <div className="mt-4 flex justify-between space-x-3 px-5 pt-0 pb-1 print:hidden">
                    <motion.button
                        onClick={handleDownloadPdf}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                            isDocumentFinalized
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        }`}
                        disabled={!isDocumentFinalized}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Download className="w-4 h-4" />
                        <span>Descargar PDF Oficial</span>
                    </motion.button>

                    <div className="flex space-x-3">
                        {isEditing ? (
                            <>
                                <motion.button
                                    onClick={() => {
                                        setContent(documentData.content);
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 text-sm text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancelar Edición
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSave(false)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-blue-700 transition-all"
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Guardar Borrador</span>
                                </motion.button>
                            </>
                        ) : (
                            <>
                                {!documentData.is_finalized && (
                                    <motion.button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-amber-500/10 text-amber-600 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Editar Documento
                                    </motion.button>
                                )}

                                {!documentData.is_finalized ? (
                                    <motion.button
                                        onClick={() => handleSave(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-emerald-600 transition-all"
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSaving}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Finalizar y Aprobar</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={handleExport}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            documentData.is_synced
                                                ? 'bg-slate-400 text-white cursor-default'
                                                : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 shadow-lg'
                                        }`}
                                        whileTap={
                                            documentData.is_synced ? {} : { scale: 0.98 }
                                        }
                                        disabled={documentData.is_synced || isSaving}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>
                                            {documentData.is_synced
                                                ? 'Exportado a HIS'
                                                : 'Exportar a HIS'}
                                        </span>
                                    </motion.button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentView;
