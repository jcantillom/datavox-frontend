// src/components/document/DocumentActions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Download, Edit3, Save, CheckCircle,
    Upload, RefreshCcw
} from 'lucide-react';

export const DocumentActions = ({
                                    isEditing,
                                    isSaving,
                                    isFinalized,
                                    isSynced,
                                    onEdit,
                                    onSave,
                                    onFinalize,
                                    onExport,
                                    onDownload,
                                    onCancelEdit
                                }) => {
    return (
        <div className="mt-4 flex justify-between space-x-3 px-5 pt-0 pb-1 print:hidden">
            <motion.button
                onClick={onDownload}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                    isFinalized
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                }`}
                disabled={!isFinalized}
                whileTap={{ scale: 0.98 }}
            >
                <Download className="w-4 h-4" />
                <span>Descargar PDF Oficial</span>
            </motion.button>

            <div className="flex space-x-3">
                {isEditing ? (
                    <>
                        <motion.button
                            onClick={onCancelEdit}
                            className="px-4 py-2 text-sm text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                            disabled={isSaving}
                        >
                            Cancelar Edición
                        </motion.button>
                        <motion.button
                            onClick={() => onSave(false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-sky-700 transition-all"
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
                        {!isFinalized && (
                            <motion.button
                                onClick={onEdit}
                                className="px-4 py-2 bg-amber-500/10 text-amber-600 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors"
                                whileTap={{ scale: 0.98 }}
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar Documento
                            </motion.button>
                        )}

                        {!isFinalized ? (
                            <motion.button
                                onClick={() => onFinalize(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-emerald-600 transition-all"
                                whileTap={{ scale: 0.98 }}
                                disabled={isSaving}
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Finalizar y Aprobar</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={onExport}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    isSynced
                                        ? 'bg-slate-400 text-white cursor-default'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 shadow-lg'
                                }`}
                                whileTap={isSynced ? {} : { scale: 0.98 }}
                                disabled={isSynced || isSaving}
                            >
                                <Upload className="w-4 h-4" />
                                <span>
                                    {isSynced ? 'Exportado a HIS' : 'Exportar a HIS'}
                                </span>
                            </motion.button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};