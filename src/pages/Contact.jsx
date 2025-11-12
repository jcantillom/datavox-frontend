// src/pages/Contact.jsx
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {
    Building,
    User,
    Mail,
    Phone,
    MessageSquare,
    Stethoscope,
    Scan,
    Radiation,
    Hospital,
    ArrowRight,
    Syringe
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

const Contact = () => {
    const [formData, setFormData] = useState({
        institution: '',
        contactName: '',
        email: '',
        phone: '',
        institutionType: 'clinic',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de envío del formulario
        console.log('Form data:', formData);
        alert('¡Gracias por su interés! Nos pondremos en contacto pronto.');
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const institutionTypes = [
        {value: 'clinic', label: 'Clínica / Consultorio', icon: Stethoscope},
        {value: 'radiology', label: 'Centro Radiológico', icon: Radiation},
        {value: 'hospital', label: 'Hospital', icon: Hospital},
        {value: 'laboratory', label: 'Laboratorio Clínico', icon: Syringe}
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Solución <span
                            className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">DataVoxMedical</span> para
                            su Institución
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Complete el formulario y nos contactaremos para una demostración personalizada de nuestra
                            plataforma.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Formulario */}
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tipo de Institución */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Tipo de Institución Médica *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {institutionTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    formData.institutionType === type.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="institutionType"
                                                    value={type.value}
                                                    checked={formData.institutionType === type.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <type.icon className={`w-6 h-6 mb-2 ${
                                                    formData.institutionType === type.value ? 'text-blue-600' : 'text-gray-400'
                                                }`}/>
                                                <span className={`text-sm font-medium ${
                                                    formData.institutionType === type.value ? 'text-blue-700' : 'text-gray-600'
                                                }`}>
                          {type.label}
                        </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Campos del formulario */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Building className="w-4 h-4 inline mr-2 text-blue-500"/>
                                            Nombre de la Institución *
                                        </label>
                                        <input
                                            type="text"
                                            name="institution"
                                            required
                                            value={formData.institution}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ej: Clínica Medellín S.A.S."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2 text-blue-500"/>
                                            Nombre del Contacto *
                                        </label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            required
                                            value={formData.contactName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Su nombre completo"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-2 text-blue-500"/>
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="email@institucion.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2 text-blue-500"/>
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="+57 300 123 4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <MessageSquare className="w-4 h-4 inline mr-2 text-blue-500"/>
                                            Mensaje o Necesidades Específicas
                                        </label>
                                        <textarea
                                            name="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Describa sus necesidades específicas o preguntas..."
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full flex justify-center items-center space-x-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-teal-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                >
                                    <Stethoscope className="w-5 h-5"/>
                                    <span>Solicitar Demo Personalizada</span>
                                    <ArrowRight className="w-5 h-5"/>
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Información */}
                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-4">¿Por qué DataVoxMedical?</h2>
                                <p className="text-blue-100 mb-6 leading-relaxed">
                                    Somos la plataforma líder en transformación de dictados médicos en documentación
                                    clínica
                                    automatizada.
                                    Más de 50 instituciones médicas confían en nosotros.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Stethoscope className="w-4 h-4"/>
                                        </div>
                                        <span className="font-semibold">Para Clínicas y Consultorios</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Scan className="w-4 h-4"/>
                                        </div>
                                        <span className="font-semibold">Para Centros Radiológicos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Hospital className="w-4 h-4"/>
                                        </div>
                                        <span className="font-semibold">Para Hospitales</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                                    <div
                                        className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Stethoscope className="w-6 h-6 text-green-600"/>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">70%</h3>
                                    <p className="text-sm text-gray-600">Menos tiempo en documentación</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                                    <div
                                        className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Scan className="w-6 h-6 text-blue-600"/>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">99.8%</h3>
                                    <p className="text-sm text-gray-600">Precisión en transcripción</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3">Próximos Pasos</h3>
                                <ol className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1
                                        </div>
                                        <span>Evaluamos sus necesidades específicas</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2
                                        </div>
                                        <span>Configuramos una demo personalizada</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div
                                            className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3
                                        </div>
                                        <span>Implementamos en su institución</span>
                                    </li>
                                </ol>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;