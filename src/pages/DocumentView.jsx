// src/pages/DocumentView.jsx
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
    X, CheckCircle, Save, Download, FileText, ArrowLeft, Radiation, Stethoscope, Pill, AlertCircle, RefreshCcw
} from 'lucide-react';
import {clinicalService} from '../services/clinical';

const DOCUMENT_TYPES_MAP = {
    clinical_history: {label: 'Historia Clínica', color: 'indigo', icon: Stethoscope},
    radiology_report: {label: 'Informe Radiológico', color: 'amber', icon: Radiation},
    medical_prescription: {label: 'Fórmula Médica', color: 'emerald', icon: Pill},
    medical_certificate: {label: 'Certificado Médico', color: 'purple', icon: FileText},
    incapacity: {label: 'Incapacidad', color: 'red', icon: FileText}
};

const DocumentView = ({documentId, onBack}) => {
    const [documentData, setDocumentData] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Definición segura de la configuración
    const docConfig = documentData ?
        DOCUMENT_TYPES_MAP[documentData.document_type] || DOCUMENT_TYPES_MAP.clinical_history :
        DOCUMENT_TYPES_MAP.clinical_history;

    // Extracción segura del componente Icono
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
            // Suponiendo un servicio para obtener el documento por ID (que debemos agregar a clinical.js)
            const doc = await clinicalService.getDocumentById(documentId);
            setDocumentData(doc);
            setContent(doc.content);
        } catch (err) {
            console.error("Error cargando documento:", err);
            setError(err.message || "No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (isFinalizing = false) => {
        setIsSaving(true);
        setError(null);
        try {
            // Llama al servicio de actualización
            const updatedDoc = await clinicalService.updateDocumentContent(documentId, content, isFinalizing);

            setDocumentData(updatedDoc);
            setIsEditing(false);
            if (isFinalizing) {
                alert("Documento Finalizado. Listo para ser exportado.");
            } else {
                alert("Cambios guardados.");
            }
        } catch (err) {
            setError(err.message || "Error al guardar el documento.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!documentData.is_finalized) {
            alert("Debe finalizar el documento antes de exportar.");
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            const exportedDoc = await clinicalService.exportDocument(documentId);
            setDocumentData(exportedDoc);
            alert(`Documento Exportado a HIS: ${exportedDoc.is_synced ? 'Sincronización Iniciada' : 'Error en Integración'}`);
        } catch (e) {
            setError(e.message || "Error al disparar la exportación.");
        } finally {
            setIsSaving(false);
        }
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
            <div className="text-center p-10 bg-red-50/70 border border-red-200 rounded-2xl shadow-xl text-red-700 font-semibold">
                <AlertCircle className="w-6 h-6 mx-auto mb-3"/>
                {error}
                <button onClick={onBack} className="mt-4 text-blue-600 font-semibold flex items-center mx-auto">
                    <ArrowLeft className="w-4 h-4 mr-2"/> Volver a Reportes
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
        >
            <div className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    {/* CORRECCIÓN: Usa DocIcon extraído */}
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
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4"/>
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/50">
                <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
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

                {/* Área de Contenido */}
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm font-mono"
                        placeholder="Edite el contenido del documento médico..."
                        disabled={isSaving}
                    />
                ) : (
                    <div className="w-full h-96 p-4 border border-gray-100 bg-gray-50 rounded-lg overflow-y-auto shadow-inner text-gray-800 whitespace-pre-wrap text-sm">
                        {documentData.content}
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="mt-6 flex justify-end space-x-3">
                    {isEditing ? (
                        <>
                            <motion.button
                                onClick={() => {setContent(documentData.content); setIsEditing(false);}}
                                className="px-4 py-2 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                disabled={isSaving}
                            >
                                Cancelar Edición
                            </motion.button>
                            <motion.button
                                onClick={() => handleSave(false)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 transition-all"
                                whileTap={{scale: 0.98}}
                                disabled={isSaving}
                            >
                                {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                <span>Guardar Borrador</span>
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {/* Botón de Edición/Finalización */}
                            {!documentData.is_finalized && (
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-amber-500/10 text-amber-600 font-semibold rounded-xl hover:bg-amber-100 transition-colors"
                                    whileTap={{scale: 0.98}}
                                >
                                    Editar / Finalizar
                                </motion.button>
                            )}

                            {/* Botón de Finalizar/Exportar */}
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
                                    <Download className="w-4 h-4"/>
                                    <span>{documentData.is_synced ? 'Exportado a HIS' : 'Exportar a HIS'}</span>
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentView;