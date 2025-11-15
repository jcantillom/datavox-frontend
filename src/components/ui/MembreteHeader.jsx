// src/components/ui/MembreteHeader.jsx - VERSIÓN CLÍNICA PROFESIONAL

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail, Phone, MapPin, Briefcase, Heart,
    Shield, Award, Activity, Stethoscope, Cross
} from 'lucide-react';

/**
 * Componente Visual del Membrete (Letterhead) - Diseño Clínico Profesional
 * @param {object} tenantMetadata - Objeto que contiene el nombre y el campo 'meta' del tenant.
 * @param {boolean} [isPrintMode=false] - Indica si el componente se renderiza en modo impresión.
 */
const MembreteHeader = ({ tenantMetadata, isPrintMode = false }) => {
    const [logoError, setLogoError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setLogoError(false);
    }, [tenantMetadata]);

    if (!tenantMetadata) {
        return null;
    }

    const { name, code, meta } = tenantMetadata;
    const { logo_url, address, phone_support, legal_id, slogan, specialty } = meta || {};

    const institutionName = name || 'DataVox Medical Center';
    const contactEmail = `contacto@${code || 'datavoxmedical'}.com`;
    const institutionSpecialty = specialty || 'Medicina Inteligente';

    // Efectos de partículas médicas - Colores clínicos
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${
                        i % 3 === 0 ? 'w-2 h-2 bg-blue-400/40' :
                            i % 3 === 1 ? 'w-3 h-3 bg-emerald-300/30' :
                                'w-1 h-1 bg-teal-400/50'
                    }`}
                    initial={{
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        scale: [0, 1.2, 0],
                        opacity: [0, 0.7, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: 'easeInOut'
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                />
            ))}
        </div>
    );

    // Logo clínico profesional
    const renderLogo = () => {
        if (logo_url && logo_url.startsWith('http') && !logoError) {
            return (
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                    <img
                        src={logo_url}
                        alt={`${institutionName} Logo`}
                        className="relative z-10 h-20 w-auto object-contain mx-auto print:h-16 filter drop-shadow-lg"
                        onError={() => setLogoError(true)}
                    />
                </motion.div>
            );
        }

        // Logo médico de fallback - Diseño clínico
        return (
            <motion.div
                className="flex flex-col items-center justify-center space-y-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={`relative w-16 h-16 rounded-xl flex items-center justify-center 
                                ${
                        isPrintMode
                            ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200'
                            : 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-500/25'
                    } print:w-14 print:h-14 print:bg-white print:border-2 print:border-blue-300`}
                >
                    {/* Cruz médica sutil */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <Cross className="w-10 h-10 text-white/20" />
                    </motion.div>

                    <motion.div
                        animate={{
                            scale: isHovered ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={`w-8 h-8 ${
                                isPrintMode ? 'text-blue-600' : 'text-white'
                            } print:w-6 print:h-6`}
                        />
                    </motion.div>

                    {/* Puntos médicos decorativos */}
                    <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full shadow-md"
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5
                        }}
                    />
                </div>

                {!isPrintMode && (
                    <motion.span
                        className="text-xs font-bold text-blue-700"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        SALUD DIGITAL
                    </motion.span>
                )}
            </motion.div>
        );
    };

    // Badge de especialidad clínica
    const SpecialtyBadge = () => (
        <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
        >
            <Stethoscope className="w-3 h-3" />
            <span>{institutionSpecialty}</span>
        </motion.div>
    );

    // --- RENDERIZADO PARA LA VISTA WEB (CLÍNICO PROFESIONAL) ---
    if (!isPrintMode) {
        return (
            <motion.div
                id="membrete-header"
                className="relative bg-gradient-to-br from-white via-blue-50 to-teal-50 rounded-2xl p-6 mb-6 shadow-lg border border-blue-200/50 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Fondos animados médicos */}
                <FloatingParticles />

                {/* Efecto de ondas médicas */}
                <div className="absolute inset-0 opacity-10">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        animate={{
                            x: [-100, 100]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </div>

                <div className="relative z-10">
                    {/* Header Principal */}
                    <div className="flex justify-between items-start pb-4">
                        {/* Logo y Nombre */}
                        <div className="flex items-center space-x-4">
                            {renderLogo()}
                            <div className="space-y-2">
                                <motion.h2
                                    className="text-2xl font-bold text-slate-800 tracking-tight"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {institutionName}
                                </motion.h2>

                                {slogan && (
                                    <motion.p
                                        className="text-sm text-teal-600 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {slogan}
                                    </motion.p>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <SpecialtyBadge />
                                </motion.div>
                            </div>
                        </div>

                        {/* Información de Contacto - Diseño Clínico */}
                        <motion.div
                            className="text-right space-y-2 min-w-[180px]"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {legal_id && (
                                <div className="flex items-center justify-end space-x-2 text-slate-700 font-semibold">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">{legal_id}</span>
                                </div>
                            )}

                            {address && (
                                <div className="flex items-center justify-end space-x-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm">{address}</span>
                                </div>
                            )}

                            {phone_support && (
                                <div className="flex items-center justify-end space-x-2 text-slate-600">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm">{phone_support}</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Footer con Email y Certificaciones */}
                    <motion.div
                        className="pt-3 flex justify-between items-center border-t border-blue-200/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center space-x-3 text-slate-600">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{contactEmail}</span>
                            </div>
                        </div>

                        {/* Certificaciones Médicas */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded border border-blue-200">
                                <Award className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-700 font-semibold">HIPAA</span>
                            </div>

                            <div className="flex items-center space-x-1 bg-teal-100 px-2 py-1 rounded border border-teal-200">
                                <Activity className="w-3 h-3 text-teal-600" />
                                <span className="text-xs text-teal-700 font-semibold">
                                    ISO 13485
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    // --- RENDERIZADO PARA MODO IMPRESIÓN (PDF) - DISEÑO CLÍNICO PROFESIONAL ---
    return (
        <motion.div
            id="membrete-header-print"
            className="w-full pb-4 mb-6 border-b border-slate-300 print:pb-3 print:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header Principal para Impresión */}
            <div className="flex items-center justify-between mb-3 print:mb-2">
                {/* Logo e Información de la Institución */}
                <div className="flex items-center space-x-3 flex-1">
                    {renderLogo()}
                    <div className="text-left flex-1">
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight print:text-lg">
                            {institutionName}
                        </h1>
                        {slogan && (
                            <p className="text-xs text-teal-700 font-medium mt-1 print:text-xs">
                                {slogan}
                            </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200">
                                {institutionSpecialty}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="text-right text-xs text-slate-700 space-y-1 print:text-[0.65rem]">
                    {address && (
                        <div className="flex items-center justify-end space-x-1">
                            <MapPin className="w-3 h-3 text-blue-600 print:w-2 print:h-2" />
                            <span>{address}</span>
                        </div>
                    )}
                    {phone_support && (
                        <div className="flex items-center justify-end space-x-1">
                            <Phone className="w-3 h-3 text-teal-600 print:w-2 print:h-2" />
                            <span>{phone_support}</span>
                        </div>
                    )}
                    {legal_id && (
                        <div className="flex items-center justify-end space-x-1 font-semibold">
                            <Shield className="w-3 h-3 text-slate-600 print:w-2 print:h-2" />
                            <span>{legal_id}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Línea decorativa médica */}
            <div className="h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 rounded-full relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{
                        x: [-100, 100]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
            </div>

            {/* Información de Contacto Inferior */}
            <div className="flex justify-between items-center mt-2 text-[0.65rem] text-slate-600 print:mt-1">
                <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                        <Mail className="w-2 h-2 text-blue-600" />
                        <span>{contactEmail}</span>
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1 font-semibold text-blue-700">
                        <Award className="w-2 h-2" />
                        <span>HIPAA CERTIFIED</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MembreteHeader;
