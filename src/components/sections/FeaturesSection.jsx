// src/components/sections/FeaturesSection.jsx
import React from 'react';
import {motion} from 'framer-motion';
import {Stethoscope, FileText, Zap, Shield} from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Stethoscope,
            title: 'Historias Clínicas Automáticas',
            description: 'Convierte dictados médicos en historias clínicas completas automáticamente.',
            color: 'blue'
        },
        {
            icon: FileText,
            title: 'Informes Radiológicos',
            description: 'Genera informes profesionales con membrete institucional y firma digital.',
            color: 'teal'
        },
        {
            icon: Zap,
            title: 'Ahorro de Tiempo',
            description: 'Reduce hasta 70% el tiempo de documentación médica.',
            color: 'green'
        },
        {
            icon: Shield,
            title: 'Certificación HIPAA',
            description: 'Plataforma segura y compliant con regulaciones médicas.',
            color: 'purple'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Solución Integral para Instituciones Médicas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Diseñada específicamente para las necesidades del sector salud
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                            className="text-center p-6"
                        >
                            <div
                                className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                <feature.icon className={`w-8 h-8 text-${feature.color}-600`}/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;