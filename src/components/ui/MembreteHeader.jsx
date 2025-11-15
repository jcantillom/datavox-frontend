// src/components/ui/MembreteHeader.jsx

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Activity, Heart } from 'lucide-react';

/**
 * Componente Visual del Membrete (Letterhead).
 * @param {object} tenantMetadata - Objeto que contiene el nombre y el campo 'meta' del tenant.
 * @param {boolean} [isPrintMode=false] - Indica si el componente se renderiza en modo impresión.
 */
const MembreteHeader = ({ tenantMetadata, isPrintMode = false }) => {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false);
    }, [tenantMetadata]);

    if (!tenantMetadata) return null;

    const { name, code, meta } = tenantMetadata;
    const { logo_url, address, phone_support, legal_id, slogan } = meta || {};

    const institutionName = name || 'Clínica DataVox';
    const contactEmail = `contacto@${code || 'tuempresa'}.com`;

    const renderLogo = () => {
        // Logo oficial del tenant
        if (logo_url && logo_url.startsWith('http') && !logoError) {
            return (
                <img
                    src={logo_url}
                    alt={`${institutionName} Logo`}
                    className={`${isPrintMode ? 'h-14' : 'h-16'} w-auto object-contain`}
                    onError={() => setLogoError(true)}
                />
            );
        }

        // Fallback DataVoxMedical
        return (
            <div
                className={`flex items-center justify-center rounded-2xl
                ${isPrintMode
                    ? 'h-12 w-12 border border-slate-400 text-slate-700 bg-white'
                    : 'h-14 w-14 bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-400 text-white shadow-lg'
                }`}
            >
                <Heart className={isPrintMode ? 'w-6 h-6' : 'w-7 h-7'} />
            </div>
        );
    };

    // ====================== VISTA WEB ======================
    if (!isPrintMode) {
        return (
            <div
                id="membrete-header"
                className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
            >
                {/* Barra superior de acento */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />

                <div className="relative flex items-start justify-between gap-6 px-6 py-5">
                    {/* Lado izquierdo: logo + institución */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {renderLogo()}
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                Plataforma clínica inteligente
                            </p>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                                {institutionName}
                            </h1>
                            {slogan ? (
                                <p className="mt-1 text-sm font-medium text-indigo-600">
                                    {slogan}
                                </p>
                            ) : (
                                <p className="mt-1 text-sm text-slate-500">
                                    Excelencia médica y humana · Reportes digitales
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Lado derecho: información de contacto */}
                    <div className="flex flex-col items-end gap-1 text-xs text-slate-600">
                        {legal_id && (
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                                <Briefcase className="h-3 w-3 text-indigo-500" />
                                <span>{legal_id}</span>
                            </div>
                        )}

                        <div className="mt-2 space-y-1 text-right">
                            {address && (
                                <div className="flex items-center justify-end gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                                    <span>{address}</span>
                                </div>
                            )}
                            {phone_support && (
                                <div className="flex items-center justify-end gap-2">
                                    <Phone className="h-3.5 w-3.5 text-indigo-500" />
                                    <span>{phone_support}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-end gap-2">
                                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                                <span>{contactEmail}</span>
                            </div>
                        </div>

                        {/* Chip DataVox / branding */}
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                            <Activity className="h-3 w-3" />
                            <span>DataVoxMedical · Reportes clínicos inteligentes</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ====================== MODO IMPRESIÓN (PDF) ======================
    return (
        <div
            id="membrete-header-print"
            className="w-full mb-4 pb-3 border-b border-slate-300"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Logo + institución */}
                <div className="flex items-center gap-3">
                    {renderLogo()}
                    <div className="text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 print:text-xl">
                            {institutionName}
                        </h1>
                        {slogan && (
                            <p className="mt-1 text-xs italic text-slate-600 print:not-italic">
                                {slogan}
                            </p>
                        )}
                    </div>
                </div>

                {/* Datos de contacto */}
                <div className="space-y-0.5 text-right text-[11px] text-slate-700">
                    {address && (
                        <div className="flex items-center justify-end gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span>{address}</span>
                        </div>
                    )}
                    {phone_support && (
                        <div className="flex items-center justify-end gap-1.5">
                            <Phone className="h-3 w-3" />
                            <span>{phone_support}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-end gap-1.5">
                        <Mail className="h-3 w-3" />
                        <span>{contactEmail}</span>
                    </div>
                    {legal_id && (
                        <div className="flex items-center justify-end gap-1.5 font-semibold">
                            <Briefcase className="h-3 w-3" />
                            <span>{legal_id}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Línea inferior fuerte para separar membrete del informe */}
            <div className="mt-2 h-[2px] w-full bg-slate-800" />
        </div>
    );
};

export default MembreteHeader;
