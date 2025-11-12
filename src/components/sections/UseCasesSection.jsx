// src/components/sections/UseCasesSection.jsx
import React from 'react';
import {motion} from 'framer-motion';
import {Users, Radiation, Building, Syringe, Hospital} from 'lucide-react';

const UseCasesSection = () => {
    const useCases = [
        {
            icon: Building,
            title: 'Clínicas y Consultorios',
            description: 'Automatice historias clínicas y reduzca tiempo administrativo.'
        },
        {
            icon: Radiation,
            title: 'Centros Radiológicos',
            description: 'Informes radiológicos automáticos con calidad profesional.'
        },
        {
            icon: Hospital,
            title: 'Hospitales',
            description: 'Solución escalable para múltiples departamentos y especialidades.'
        },
        {
            icon: Syringe,
            title: 'Laboratorios',
            description: 'Documentación precisa de resultados y diagnósticos.'
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Para Todo Tipo de Instituciones Médicas
                    </h2>
                    <p className="text-xl text-gray-600">
                        Adaptable a sus necesidades específicas
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={useCase.title}
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <useCase.icon className="w-12 h-12 text-blue-600 mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {useCase.title}
                            </h3>
                            <p className="text-gray-600">
                                {useCase.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;