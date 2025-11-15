// src/components/document/DocumentHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { DOCUMENT_TYPES_MAP } from '../../constants/documentTypes';

export const DocumentHeader = ({ documentType, onBack }) => {
    const docConfig = DOCUMENT_TYPES_MAP[documentType] || DOCUMENT_TYPES_MAP.clinical_history;
    const DocIcon = docConfig.icon;

    return (
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
    );
};