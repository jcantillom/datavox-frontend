// src/components/ui/MembreteHeader.jsx - VERSIÓN ULTRA MODERNA Y PROFESIONAL

import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
    Mail, Phone, MapPin, Briefcase, Heart, Hospital,
    Shield, Star, Award, Zap, Sparkles, Activity,
    Target, Clock, Users, CheckCircle
} from 'lucide-react';

/**
 * Componente Visual del Membrete (Letterhead) - Diseño Ultra Moderno
 */
const MembreteHeader = ({tenantMetadata, isPrintMode = false}) => {
    const [logoError, setLogoError] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        setLogoError(false);
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [tenantMetadata]);

    if (!tenantMetadata) {
        return null;
    }

    const {name, code, meta} = tenantMetadata;
    const {logo_url, address, phone_support, legal_id, slogan, specialty} = meta || {};

    const institutionName = name || 'DataVox Medical';
    const contactEmail = `contacto@${code || 'datavoxmedical'}.com`;
    const formattedTime = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit', minute: '2-digit'
    });

    // Logo moderno con animaciones
    const renderLogo = () => {
        if (logo_url && logo_url.startsWith('http') && !logoError) {
            return (
                <motion.div
                    initial={{scale: 0.8, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.6}}
                    className="relative"
                >
                    <img
                        src={logo_url}
                        alt={`${institutionName} Logo`}
                        className="h-20 w-20 object-contain rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                        onError={() => setLogoError(true)}
                    />
                    <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-sm"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            );
        }

        // Logo de fallback ultra moderno
        return (
            <motion.div
                initial={{scale: 0, rotate: -180}}
                animate={{scale: 1, rotate: 0}}
                transition={{duration: 0.8, type: "spring"}}
                className="relative group"
            >
                <div
                    className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                    {/* Efecto de partículas animadas */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30"
                        animate={{
                            x: [-100, 100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        <Heart className="w-8 h-8 text-white mb-1"/>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-white rounded-full"
                                    animate={{
                                        height: [3, 8, 3],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Efecto de brillo al hover */}
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-500"
                    whileHover={{scale: 1.1}}
                />
            </motion.div>
        );
    };

    // Badge de especialidad médica
    const renderSpecialtyBadge = () => {
        if (!specialty) return null;

        return (
            <motion.div
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{delay: 0.3, type: "spring"}}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            >
                <Target className="w-3 h-3"/>
                <span>{specialty}</span>
            </motion.div>
        );
    };

    // Indicadores de calidad
    const renderQualityIndicators = () => {
        const indicators = [
            {icon: Shield, label: 'Certificado HIPAA', color: 'emerald'},
            {icon: CheckCircle, label: 'Calidad Garantizada', color: 'blue'},
            {icon: Zap, label: 'Tiempo Real', color: 'amber'},
        ];

        return (
            <div className="flex items-center space-x-3">
                {indicators.map((indicator, index) => (
                    <motion.div
                        key={indicator.label}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4 + index * 0.1}}
                        className="flex items-center space-x-1 text-xs text-gray-600"
                    >
                        <indicator.icon className={`w-3 h-3 text-${indicator.color}-500`}/>
                        <span className="font-semibold">{indicator.label}</span>
                    </motion.div>
                ))}
            </div>
        );
    };

    // --- RENDERIZADO PARA LA VISTA WEB ULTRA MODERNA ---
    if (!isPrintMode) {
        return (
            <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                id="membrete-header"
                className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden"
            >
                {/* Fondo animado */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10"></div>
                    <motion.div
                        className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                <div className="relative z-10">
                    {/* Header Principal */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-6">
                            {renderLogo()}
                            <div className="space-y-2">
                                <motion.h1
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.2}}
                                    className="text-4xl font-black text-white tracking-tight"
                                >
                                    {institutionName}
                                </motion.h1>

                                {slogan && (
                                    <motion.p
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.3}}
                                        className="text-blue-200 text-lg font-semibold flex items-center space-x-2"
                                    >
                                        <Sparkles className="w-4 h-4"/>
                                        <span>{slogan}</span>
                                    </motion.p>
                                )}

                                {renderSpecialtyBadge()}
                            </div>
                        </div>

                        {/* Información de Contacto Mejorada */}
                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.4}}
                            className="text-right space-y-3"
                        >
                            {/* Tiempo actual */}
                            <div className="flex items-center justify-end space-x-2 text-blue-200 text-sm">
                                <Clock className="w-4 h-4"/>
                                <span className="font-mono font-bold">{formattedTime}</span>
                            </div>

                            {legal_id && (
                                <div className="flex items-center justify-end space-x-2 text-white font-bold">
                                    <Briefcase className="w-4 h-4 text-cyan-400"/>
                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        {legal_id}
                                    </span>
                                </div>
                            )}

                            {address && (
                                <div className="flex items-center justify-end space-x-2 text-white/90">
                                    <MapPin className="w-4 h-4 text-emerald-400"/>
                                    <span className="text-sm">{address}</span>
                                </div>
                            )}

                            {phone_support && (
                                <div className="flex items-center justify-end space-x-2 text-white/90">
                                    <Phone className="w-4 h-4 text-green-400"/>
                                    <span className="text-sm font-semibold">{phone_support}</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Footer con Indicadores de Calidad */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.5}}
                        className="flex justify-between items-center pt-4 border-t border-white/20"
                    >
                        {renderQualityIndicators()}

                        <div className="flex items-center space-x-3 text-white/80">
                            <Mail className="w-4 h-4 text-blue-400"/>
                            <span className="text-sm font-semibold">{contactEmail}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    // --- RENDERIZADO PARA MODO IMPRESIÓN (PDF) - DISEÑO PROFESIONAL ---
    return (
        <div id="membrete-header-print" className="w-full pb-6 mb-6 border-b-2 border-gray-300 print:border-gray-400">
            <div className="flex items-center justify-between">
                {/* Logo e Institución */}
                <div className="flex items-center space-x-4">
                    {renderLogo()}
                    <div className="text-left">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                            {institutionName}
                        </h1>
                        {slogan && (
                            <p className="text-sm text-blue-600 font-semibold mt-1">{slogan}</p>
                        )}
                        {specialty && (
                            <div className="flex items-center space-x-1 mt-1">
                                <Target className="w-3 h-3 text-emerald-600"/>
                                <span className="text-xs font-bold text-emerald-700">{specialty}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="text-right text-xs text-gray-700 space-y-1">
                    {legal_id && (
                        <div className="font-bold text-gray-900">
                            <Briefcase className="w-3 h-3 inline mr-1 text-blue-600"/>
                            {legal_id}
                        </div>
                    )}
                    {address && (
                        <div>
                            <MapPin className="w-3 h-3 inline mr-1 text-green-600"/>
                            {address}
                        </div>
                    )}
                    {phone_support && (
                        <div>
                            <Phone className="w-3 h-3 inline mr-1 text-emerald-600"/>
                            {phone_support}
                        </div>
                    )}
                    <div>
                        <Mail className="w-3 h-3 inline mr-1 text-purple-600"/>
                        {contactEmail}
                    </div>
                </div>
            </div>

            {/* Línea decorativa */}
            <div className="mt-4 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3 text-emerald-600"/>
                            <span>Certificado HIPAA</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-blue-600"/>
                            <span>Calidad Garantizada</span>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        Generado el {new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembreteHeader;