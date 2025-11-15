// src/components/document/DocumentMetadata.jsx
import React from 'react';
import {
    User, Stethoscope, AlignLeft, Calendar,
    Activity, ClipboardList, Scan, Pill,
    FileText, UserCheck, ShieldCheck
} from 'lucide-react';
import { DOCUMENT_TYPES_MAP } from '../../constants/documentTypes';

export const DocumentMetadata = ({ documentData, documentId }) => {
    const docConfig = documentData
        ? DOCUMENT_TYPES_MAP[documentData.document_type] || DOCUMENT_TYPES_MAP.clinical_history
        : DOCUMENT_TYPES_MAP.clinical_history;

    const DocIcon = docConfig.icon;
    const isFinalized = documentData?.is_finalized;
    const isSynced = documentData?.is_synced;

    const getStatusConfig = () => {
        if (isSynced) {
            return {
                label: 'SINCRONIZADO CON HIS',
                className: 'border-emerald-200 bg-emerald-50 text-emerald-700'
            };
        }
        if (isFinalized) {
            return {
                label: 'FINALIZADO · PENDIENTE HIS',
                className: 'border-sky-200 bg-sky-50 text-sky-700'
            };
        }
        return {
            label: 'BORRADOR EN EDICIÓN',
            className: 'border-amber-200 bg-amber-50 text-amber-700'
        };
    };

    const status = getStatusConfig();

    return (
        <div className="mb-5 pb-5 border-b border-slate-200 print:hidden">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-${docConfig.color}-50 text-${docConfig.color}-600`}>
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

                <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold ${status.className}`}>
                        <Activity className="h-3 w-3" />
                        {status.label}
                    </span>
                    <p className="text-[0.7rem] text-slate-500">
                        Creado el {new Date(documentData.created_at).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    })}
                    </p>
                </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-[0.8rem] text-slate-700 md:grid-cols-4">
                <MetadataItem
                    label="Paciente / ID"
                    value={documentData.clinical_meta?.patient_id}
                    icon={User}
                />
                <MetadataItem
                    label="Médico responsable"
                    value={documentData.clinical_meta?.doctor_name}
                    icon={Stethoscope}
                />
                <MetadataItem
                    label="Asunto / estudio"
                    value={documentData.clinical_meta?.clinical_subject}
                    icon={AlignLeft}
                />
                <MetadataItem
                    label="Fecha del informe"
                    value={new Date(documentData.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })}
                    icon={Calendar}
                />
            </div>
        </div>
    );
};

const MetadataItem = ({ label, value, icon: Icon }) => (
    <div>
        <p className="text-[0.63rem] font-semibold uppercase tracking-wide text-slate-400">
            {label}
        </p>
        <p className="mt-0.5 flex items-center gap-1">
            <Icon className="h-3.5 w-3.5 text-indigo-500" />
            {value || 'N/A'}
        </p>
    </div>
);