// src/components/sections/SolutionsSection.jsx
import React from 'react';
import {motion} from 'framer-motion';
import {Stethoscope, Radiation, Trophy, Users, Clock, Shield, Zap, FileText} from 'lucide-react';

const SolutionsSection = () => {
    const solutions = {
        clinicas: {
            title: "Solución para Clínicas y Consultorios",
            icon: Stethoscope,
            description: "Automatice la documentación médica en su clínica con nuestra plataforma especializada.",
            features: [
                {icon: FileText, text: "Historias clínicas automáticas"},
                {icon: Clock, text: "Ahorre 70% en tiempo de documentación"},
                {icon: Users, text: "Múltiples especialidades médicas"},
                {icon: Shield, text: "Certificación HIPAA integrada"}
            ],
            benefits: [
                "Reducción de costos administrativos",
                "Mayor productividad del personal médico",
                "Documentación precisa y consistente",
                "Acceso desde cualquier dispositivo"
            ]
        },
        radiologia: {
            title: "Solución para Centros Radiológicos",
            icon: Radiation,
            description: "Generación automática de informes radiológicos profesionales con IA.",
            features: [
                {icon: FileText, text: "Informes con membrete institucional"},
                {icon: Zap, text: "Procesamiento en tiempo real"},
                {icon: Shield, text: "Firma digital integrada"},
                {icon: Clock, text: "Entrega inmediata de resultados"}
            ],
            benefits: [
                "Informes estandarizados y profesionales",
                "Reducción de tiempos de entrega",
                "Menor carga de trabajo para radiólogos",
                "Archivo digital automático"
            ]
        },
        casos: {
            title: "Casos de Éxito",
            icon: Trophy,
            description: "Descubra cómo instituciones médicas han transformado su documentación con DataVoxMedical.",
            features: [
                {icon: Users, text: "50+ instituciones confían en nosotros"},
                {icon: Zap, text: "Implementación en 2 semanas"},
                {icon: Shield, text: "99.8% de satisfacción"},
                {icon: Clock, text: "Soporte 24/7 incluido"}
            ],
            testimonials: [
                {
                    institution: "Clínica Medellín",
                    result: "Redujimos 12 horas semanales de documentación",
                    person: "Dr. Carlos Rodríguez"
                },
                {
                    institution: "Centro Radiológico Bogotá",
                    result: "Informes 3x más rápidos con mayor precisión",
                    person: "Dra. María González"
                },
                {
                    institution: "Hospital Central",
                    result: "Implementación exitosa en 15 días",
                    person: "Lic. Ana Martínez"
                }
            ]
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Solución Clínicas */}
                <div id="clinicas" className="scroll-mt-20 mb-20">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Stethoscope className="w-8 h-8 text-blue-600"/>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solución para Clínicas y Consultorios
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Automatice la documentación médica y enfoque su tiempo en lo que realmente importa: sus
                            pacientes.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                        >
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Características Principales</h3>
                            <div className="space-y-4">
                                {solutions.clinicas.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <feature.icon className="w-5 h-5 text-green-600"/>
                                        </div>
                                        <span className="text-gray-700 font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                            className="bg-blue-50 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Beneficios</h3>
                            <ul className="space-y-3">
                                {solutions.clinicas.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"/>
                                        </div>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Solución Radiología */}
                <div id="radiologia" className="scroll-mt-20 mb-20">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center border-2 border-yellow-400">
                                <Radiation className="w-8 h-8 text-black"/>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solución para Centros Radiológicos
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Generación automática de informes radiológicos con la más alta precisión y profesionalismo.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                            className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200"
                        >
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Características Principales</h3>
                            <div className="space-y-4">
                                {solutions.radiologia.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center border border-yellow-300">
                                            <feature.icon className="w-5 h-5 text-yellow-700"/>
                                        </div>
                                        <span className="text-gray-700 font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                        >
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Beneficios</h3>
                            <ul className="space-y-3">
                                {solutions.radiologia.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"/>
                                        </div>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Casos de Éxito */}
                <div id="casos" className="scroll-mt-20">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-white"/>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Casos de Éxito
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Instituciones médicas que han transformado su documentación con DataVoxMedical.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {solutions.casos.testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: index * 0.1}}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {testimonial.institution}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{testimonial.result}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{testimonial.person}</p>
                                        <p className="text-xs text-gray-500">Usuario verificado</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        className="text-center mt-12"
                    >
                        <motion.button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-teal-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Únase a nuestros casos de éxito
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SolutionsSection;