// src/components/sections/HeroSection.jsx
import React from 'react';
import {motion} from 'framer-motion';
import {ArrowRight, Stethoscope, FileText, Zap, Shield, Mic, Play} from 'lucide-react';

const HeroSection = () => {
    const features = [
        {
            icon: Stethoscope,
            text: 'Historias Clínicas Automáticas',
            desc: 'Dictado por voz que llena formularios médicos'
        },
        {
            icon: FileText,
            text: 'Informes Radiológicos Inteligentes',
            desc: 'Generación automática con membrete y firma'
        },
        {icon: Zap, text: 'Ahorro de 70% en Tiempo', desc: 'Reduce tiempo de documentación médica'},
    ];

    const cardVariants = {
        offscreen: {
            y: 50,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 1
            }
        }
    };

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">

            {/* Background Medical Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Medical Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    animate={{
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Main Heading */}
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="mb-12"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-8"
                    >
                        <Zap className="w-4 h-4 mr-2"/>
                        Plataforma Médica con IA - Transformando la Documentación Clínica
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Revolucionamos la{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Documentación
            </span>{' '}
                        Médica
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Convierte dictados médicos en{' '}
                        <span className="font-semibold text-blue-600">historias clínicas completas</span>{' '}
                        e{' '}
                        <span className="font-semibold text-teal-600">informes radiológicos profesionales</span>{' '}
                        automáticamente. Ahorre horas de trabajo administrativo.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{once: true, amount: 0.3}}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.text}
                            variants={cardVariants}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 text-center transition-all duration-300 group hover:shadow-lg hover:border-blue-200"
                            whileHover={{
                                y: -5,
                                scale: 1.02,
                                transition: {duration: 0.2}
                            }}
                        >
                            <div
                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <feature.icon
                                    className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {feature.text}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex justify-center items-center mb-16"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.6}}
                >
                    <motion.button
                        onClick={() => window.location.href = '/contact'}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl font-semibold text-white flex items-center space-x-3 group shadow-lg"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)"
                        }}
                        whileTap={{scale: 0.95}}
                        transition={{type: "spring", stiffness: 400, damping: 10}}
                    >
                        <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"/>
                        <span>Solicitar Demo Médica</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"/>
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{once: true, amount: 0.3}}
                    transition={{staggerChildren: 0.1}}
                >
                    {[
                        {number: '70%', label: 'Reducción en Tiempo'},
                        {number: '99.8%', label: 'Precisión'},
                        {number: '2.5x', label: 'Más Pacientes'},
                        {number: 'HIPAA', label: 'Certificado'},
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            variants={cardVariants}
                            className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 group cursor-default hover:shadow-md"
                            whileHover={{y: -2}}
                        >
                            <div
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                {stat.number}
                            </div>
                            <div
                                className="text-gray-600 text-sm mt-2 font-medium group-hover:text-gray-700 transition-colors duration-300">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Floating Medical Elements */}
            <motion.div
                className="absolute bottom-10 left-10 w-6 h-6 bg-blue-400 rounded-full opacity-40"
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-20 right-20 w-8 h-8 bg-teal-400 rounded-full opacity-30"
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </section>
    );
};

export default HeroSection;