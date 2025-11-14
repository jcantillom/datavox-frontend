// src/components/ui/MembreteHeader.jsx

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, HeartPulse, Hospital, Activity } from 'lucide-react';

/**
 * Componente Visual del Membrete (Letterhead).
 * Muestra la información de la institución de forma gráfica.
 * @param {object} tenantMetadata - Objeto que contiene el nombre y el campo 'meta' del tenant.
 * @param {boolean} [isPrintMode=false] - Indica si el componente se renderiza en modo impresión.
 */
const MembreteHeader = ({ tenantMetadata, isPrintMode = false }) => {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false); // Reset error state on tenantMetadata change
    }, [tenantMetadata]);

    if (!tenantMetadata) {
        return null;
    }

    const { name, code, meta } = tenantMetadata;
    const { logo_url, address, phone_support, legal_id, slogan } = meta || {};

    const institutionName = name || 'Institución Médica';
    const contactEmail = `contacto@${code || 'tuempresa'}.com`; // Ajuste el dominio por defecto

    // Lógica para renderizar el logo
    const renderLogo = () => {
        if (logo_url && logo_url.startsWith('http') && !logoError) {
            // Intenta cargar el logo del tenant
            return (
                <img
                    src={logo_url}
                    alt={`${institutionName} Logo`}
                    className="h-20 w-auto object-contain mx-auto mb-2 print:h-16 print:mb-1" // Ajuste de tamaño y centrado
                    onError={() => setLogoError(true)} // Si falla, activa el error
                />
            );
        }

        // Logo de fallback de DataVoxMedical si el del tenant falla o no existe
        return (
            <div className="flex items-center justify-center space-x-2 mx-auto mb-2 print:mb-1">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full 
                                 ${isPrintMode ? 'bg-indigo-100 text-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white'}
                                 print:w-12 print:h-12`}>
                    <Hospital className="w-8 h-8 print:w-6 print:h-6" />
                </div>
                <Activity className={`w-6 h-6 ${isPrintMode ? 'text-indigo-600' : 'text-cyan-300'} print:w-5 print:h-5`} />
            </div>
        );
    };

    // --- RENDERIZADO PARA LA VISTA WEB ---
    if (!isPrintMode) {
        return (
            <div id="membrete-header" className="bg-white p-6 border-b-4 border-indigo-500 shadow-xl mb-6 print:hidden">
                <div className="flex justify-between items-start pb-4">
                    <div className="flex items-center space-x-4">
                        {/* Logo para la vista web (más pequeño) */}
                        {renderLogo()}
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tighter">
                                {institutionName}
                            </h2>
                            {slogan && (
                                <p className="text-sm italic text-indigo-700 font-semibold mt-0.5">
                                    {slogan}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right text-gray-700 text-sm space-y-1">
                        {legal_id && (
                            <div className="flex items-center justify-end space-x-2 font-bold">
                                <Briefcase className="w-4 h-4 text-indigo-500" />
                                <span>{legal_id}</span>
                            </div>
                        )}
                        {address && (
                            <div className="flex items-center justify-end space-x-2">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                <span>{address}</span>
                            </div>
                        )}
                        {phone_support && (
                            <div className="flex items-center justify-end space-x-2">
                                <Phone className="w-4 h-4 text-indigo-500" />
                                <span>{phone_support}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-2 flex justify-end text-xs text-gray-500 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{contactEmail}</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDERIZADO PARA MODO IMPRESIÓN (PDF) ---
    return (
        <div id="membrete-header-print" className="w-full text-center pb-4 mb-6 border-b border-gray-300">
            {renderLogo()} {/* El logo más grande y centrado para impresión */}
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mt-2 print:text-2xl">
                {institutionName}
            </h1>
            {slogan && (
                <p className="text-md italic text-indigo-700 mt-1 print:text-sm">{slogan}</p>
            )}
            <div className="text-sm text-gray-600 mt-3 flex justify-center items-center space-x-4 print:text-xs">
                {address && (
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-indigo-500 print:w-2 print:h-2" />{address}</span>
                )}
                {phone_support && (
                    <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-indigo-500 print:w-2 print:h-2" />{phone_support}</span>
                )}
                <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-indigo-500 print:w-2 print:h-2" />{contactEmail}</span>
            </div>
        </div>
    );
};

export default MembreteHeader;