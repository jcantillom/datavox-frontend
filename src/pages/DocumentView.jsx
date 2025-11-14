// src/pages/DocumentView.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Edit3, Save, FileText, CheckCircle, Upload,
    Loader2, X, AlertTriangle, FileUp, Download, Stethoscope,
    Pill, Radiation, AlertCircle, RefreshCcw, MapPin, Phone,
    Mail, Briefcase, Scan, UserCheck, ClipboardList, Hospital,
    ShieldCheck, Activity, Heart, Calendar, User, AlignLeft
} from 'lucide-react';

import { clinicalService } from '../services/clinical';
import MembreteHeader from '../components/ui/MembreteHeader';


const DOCUMENT_TYPES_MAP = {
    clinical_history: {label: 'HISTORIA CLÍNICA', color: 'indigo', icon: Stethoscope, dual_icon: ClipboardList},
    radiology_report: {label: 'INFORME RADIOLÓGICO', color: 'amber', icon: Radiation, dual_icon: Scan},
    medical_prescription: {label: 'FÓRMULA MÉDICA', color: 'emerald', icon: Pill, dual_icon: Pill},
    medical_certificate: {label: 'CERTIFICADO MÉDICO', color: 'purple', icon: FileText, dual_icon: ShieldCheck},
    incapacity: {label: 'INCAPACIDAD', color: 'red', icon: FileText, dual_icon: UserCheck}
};

const DocumentView = ({ documentId, onBack, notifications, tenantMetadata }) => {
    const [documentData, setDocumentData] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const { success, error: notifyError, info } = notifications;

    const docConfig = documentData ?
        DOCUMENT_TYPES_MAP[documentData.document_type] || DOCUMENT_TYPES_MAP.clinical_history :
        DOCUMENT_TYPES_MAP.clinical_history;

    const DocIcon = docConfig.icon;


    useEffect(() => {
        if (documentId) {
            loadDocument();
        }
    }, [documentId]);

    const loadDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const doc = await clinicalService.getDocumentById(documentId);
            setDocumentData(doc);
            setContent(doc.content);
        } catch (err) {
            console.error("Error cargando documento:", err);
            setError(err.message || "No se pudo cargar el documento.");
            notifyError(`Error cargando documento ID ${documentId.substring(0, 8)}...: ${err.message}`, 8000);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (isFinalizing = false) => {
        setIsSaving(true);
        setError(null);
        try {
            const updatedDoc = await clinicalService.updateDocumentContent(documentId, content, isFinalizing);

            setDocumentData(updatedDoc);
            setIsEditing(false);

            if (isFinalizing) {
                success("Documento Finalizado y Aprobado. Listo para exportación.", 7000);
            } else {
                success("Borrador guardado exitosamente.", 5000);
            }
        } catch (err) {
            setError(err.message || "Error al guardar el documento.");
            notifyError(`Error al guardar cambios: ${err.message}`, 8000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!documentData.is_finalized) {
            notifyError("Acción Requerida: Debe finalizar el documento antes de exportar a HIS.", 6000);
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            info('Sincronización Iniciada: El documento está siendo procesado para el HIS (Asíncrono).', 7000);
            const exportedDoc = await clinicalService.exportDocument(documentId);

            setDocumentData(exportedDoc);

            success("Exportación a HIS disparada con éxito.", 7000);
        } catch (e) {
            setError(e.message || "Error al disparar la exportación.");
            notifyError(`Fallo en la exportación: ${e.message}`, 8000);
        } finally {
            setIsSaving(false);
        }
    };

    // FUNCIÓN CLAVE: Limpieza y Descarga (PDF)
    const handleDownloadPdf = () => {
        if (!documentData.is_finalized) {
            notifications.warning("Debe Finalizar el documento para descargar la versión oficial.", 6000);
            return;
        }

        const patientId = documentData.clinical_meta?.patient_id?.replace(/[^a-zA-Z0-9-]/g, '_') || 'Paciente_ID';
        const subject = documentData.clinical_meta?.clinical_subject?.replace(/[^a-zA-Z0-9-]/g, '_') || 'Informe';
        const docTypeLabel = docConfig.label.replace(/[^a-zA-Z0-9-]/g, '');

        const filename = `${patientId}-${subject}-${docTypeLabel}.pdf`;

        document.title = filename;
        window.print();

        setTimeout(() => {
            document.title = "DataVoxMedical | Revisión Documento";
        }, 500);

        notifications.info("Abriendo diálogo de impresión. Seleccione 'Guardar como PDF'.", 5000);
    }

    // FUNCIÓN CLAVE: Filtrar metadata interna del informe de texto antes de imprimir
    const getCleanContent = () => {
        if (!documentData || !documentData.content) return '';

        let cleanContent = documentData.content;

        const footerRegex = /--- FIN DEL INFORME ---[\s\S]*$/g;
        cleanContent = cleanContent.replace(footerRegex, '');

        const headerRegex = /--- INFORME MÉDICO OFICIAL ---[\s\S]*?---/g;
        cleanContent = cleanContent.replace(headerRegex, '');

        return cleanContent.trim();
    };

    // Nueva función para mostrar los datos del paciente de forma elegante en el PDF
    const getPrintPatientData = () => {
        const patientId = documentData.clinical_meta?.patient_id || 'N/A';
        const doctorName = documentData.clinical_meta?.doctor_name || 'N/A';
        const subject = documentData.clinical_meta?.clinical_subject || 'N/A';
        const date = new Date(documentData.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

        return (
            <div className="grid grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-700 print:text-black mt-4">
                <p><User className="inline-block w-4 h-4 mr-1 align-middle text-indigo-600" /><span className="font-semibold">Paciente ID:</span> {patientId}</p>
                <p className="text-right"><Stethoscope className="inline-block w-4 h-4 mr-1 align-middle text-indigo-600" /><span className="font-semibold">Médico:</span> {doctorName}</p>
                <p><AlignLeft className="inline-block w-4 h-4 mr-1 align-middle text-indigo-600" /><span className="font-semibold">Asunto:</span> {subject}</p>
                <p className="text-right"><Calendar className="inline-block w-4 h-4 mr-1 align-middle text-indigo-600" /><span className="font-semibold">Fecha:</span> {date}</p>
            </div>
        );
    };

    const getPrintFooter = () => {
        const legalId = tenantMetadata?.meta?.legal_id || 'N/A';
        const institutionName = tenantMetadata?.name || 'Institución Médica';

        return (
            <div className="print-footer text-center text-xs text-gray-600 mt-8 pt-4 border-t border-gray-300">
                <p className="font-semibold text-gray-700">{institutionName}</p>
                <p className="mt-1 flex items-center justify-center">
                    <Mail className="inline-block w-3 h-3 mr-1 align-middle" /> contact@datavox.com
                    <span className="mx-2">|</span>
                    <Phone className="inline-block w-3 h-3 mr-1 align-middle" /> +57 (310) 123-4567
                    <span className="mx-2">|</span>
                    <Briefcase className="inline-block w-3 h-3 mr-1 align-middle" /> {legalId}
                </p>
                <p className="mt-2 text-gray-500">Plataforma Inteligente de Salud potenciada por DataVoxMedical</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl text-gray-600">
                <motion.div
                    className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                    transition={{ease: "linear", duration: 1, repeat: Infinity}}
                ></motion.div>
                Cargando documento clínico...
            </div>
        );
    }

    if (error && !documentData) {
        return (
            <div
                className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl text-red-700 font-semibold">
                <AlertCircle className="w-6 h-6 mx-auto mb-3"/>
                {error}
                <motion.button onClick={onBack} className="mt-4 text-blue-600 font-semibold flex items-center mx-auto"
                               whileTap={{scale: 0.95}}>
                    <ArrowLeft className="w-4 h-4 mr-2"/> Volver a Reportes
                </motion.button>
            </div>
        );
    }

    const isDocumentFinalized = documentData?.is_finalized;
    const isDocumentSynced = documentData?.is_synced;


    return (
        <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            {/* Control Bar (Ocultar al imprimir) */}
            <div
                className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50 print:hidden">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <DocIcon className={`w-8 h-8 text-${docConfig.color}-600`}/>
                    <span>{docConfig.label} - Revisión Final</span>
                </h2>
                <motion.button
                    onClick={onBack}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600/10 text-gray-700 rounded-xl font-semibold hover:bg-gray-600/20 transition-all"
                    whileTap={{scale: 0.98}}
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Volver a Listado</span>
                </motion.button>
            </div>

            {error && (
                <div
                    className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2 print:hidden">
                    <AlertCircle className="w-4 h-4"/>
                    <span>{error}</span>
                </div>
            )}

            {/* Contenido Principal (Lo que se imprimirá/editará) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/50 print:shadow-none print:p-0 print:border-none">

                {/* Membrete VISUAL (Solo para vista de edición) */}
                <div className="print:hidden">
                    <MembreteHeader tenantMetadata={tenantMetadata} isPrintMode={false} />
                </div>

                <div className="p-6 print:p-8 print:m-0">

                    {/* Bloque de Metadata de React (OCULTAR para impresión) */}
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200 print:hidden">
                        <div className="text-sm">
                            <span className="font-semibold text-gray-600">Paciente ID:</span>
                            <p className="font-bold text-gray-900">{documentData.clinical_meta?.patient_id || 'N/A'}</p>
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-gray-600">Estado:</span>
                            <p className={`font-bold ${documentData.is_synced ? 'text-emerald-600' : documentData.is_finalized ? 'text-blue-600' : 'text-amber-600'}`}>
                                {documentData.is_synced ? 'SINCRONIZADO' : documentData.is_finalized ? 'FINALIZADO (Pend. HIS)' : 'BORRADOR'}
                            </p>
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-gray-600">Médico:</span>
                            <p className="text-gray-900">{documentData.clinical_meta?.doctor_name || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Área de Contenido (Texto del informe) */}
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm font-mono"
                            placeholder="Edite el contenido del documento médico..."
                            disabled={isSaving}
                        />
                    ) : (
                        <div
                            className="w-full min-h-[400px] p-4 border border-gray-100 bg-gray-50 rounded-lg overflow-y-auto shadow-inner text-gray-800 whitespace-pre-wrap text-sm print:shadow-none print:bg-white print:border-none print:p-0 print:text-black print:overflow-visible print:min-h-auto print:whitespace-pre-line">

                            {/* --- CONTENIDO ESPECÍFICO PARA IMPRESIÓN (PDF) --- */}
                            <div className="hidden print:block print:p-0 print:m-0 print:w-full print:h-full print:flex print:flex-col">

                                {/* Membrete Superior para PDF (Diseño 4.0) */}
                                <MembreteHeader tenantMetadata={tenantMetadata} isPrintMode={true} />

                                {/* Encabezado del Tipo de Documento y Datos */}
                                <div className="text-left mb-6 mt-4">
                                    {/* Título Principal */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center rounded-lg shadow-md`}>
                                            {React.createElement(docConfig.dual_icon, { className: `w-6 h-6 text-white` })}
                                        </div>
                                        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">{docConfig.label}</h1>
                                    </div>

                                    {/* Datos del Paciente/Documento */}
                                    {getPrintPatientData()}
                                </div>

                                {/* Contenido principal del informe */}
                                <div className="flex-grow text-base text-gray-800 leading-relaxed mb-6">
                                    {getCleanContent()}
                                </div>

                                {/* Pie de página para PDF */}
                                {getPrintFooter()}
                            </div>

                            {/* Contenido para la vista normal (no impresión) */}
                            <div className="print:hidden">
                                {getCleanContent()}
                            </div>

                        </div>
                    )}
                </div>

                {/* Botones de Acción (Ocultar al imprimir) */}
                <div className="mt-6 flex justify-between space-x-3 p-6 pt-0 print:hidden">

                    <motion.button
                        onClick={handleDownloadPdf}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all shadow-md ${isDocumentFinalized ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        disabled={!isDocumentFinalized}
                        whileTap={{scale: 0.98}}
                    >
                        <Download className="w-4 h-4"/>
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
                                    className="px-4 py-2 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancelar Edición
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSave(false)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 transition-all"
                                    whileTap={{scale: 0.98}}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin"/> :
                                        <Save className="w-4 h-4"/>}
                                    <span>Guardar Borrador</span>
                                </motion.button>
                            </>
                        ) : (
                            <>
                                {!documentData.is_finalized && (
                                    <motion.button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-amber-500/10 text-amber-600 font-semibold rounded-xl hover:bg-amber-100 transition-colors"
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Edit3 className="w-4 h-4 mr-2"/>
                                        Editar Documento
                                    </motion.button>
                                )}

                                {!documentData.is_finalized ? (
                                    <motion.button
                                        onClick={() => handleSave(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 transition-all"
                                        whileTap={{scale: 0.98}}
                                        disabled={isSaving}
                                    >
                                        <CheckCircle className="w-4 h-4"/>
                                        <span>Finalizar y Aprobar</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={handleExport}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all ${documentData.is_synced ? 'bg-gray-400 text-white cursor-default' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 shadow-lg'}`}
                                        whileTap={documentData.is_synced ? {} : {scale: 0.98}}
                                        disabled={documentData.is_synced || isSaving}
                                    >
                                        <Upload className="w-4 h-4"/>
                                        <span>{documentData.is_synced ? 'Exportado a HIS' : 'Exportar a HIS'}</span>
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