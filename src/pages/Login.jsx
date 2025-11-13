// src/pages/Login.jsx - VERSIÓN CORREGIDA
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Building,
    ArrowRight,
    Stethoscope,
    Shield,
    Mic,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {authService} from '../services/auth';
import MainLayout from '../components/layout/MainLayout';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginStatus, setLoginStatus] = useState(''); // 'success', 'error', 'loading'
    const [statusMessage, setStatusMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        tenantCode: 'clinica-medellin', // Valor por defecto
        rememberMe: false
    });

    // Función para mostrar estados - CORREGIDA
    const showLoginStatus = (status, message) => {
        setLoginStatus(status);
        setStatusMessage(message);

        if (status === 'success') {
            setTimeout(() => {
                setLoginStatus('');
                setStatusMessage('');
            }, 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setLoginStatus('loading');
        setStatusMessage('Verificando credenciales...');

        if (!formData.tenantCode.trim()) {
            setError('El código de institución es requerido');
            setLoginStatus('error');
            setStatusMessage('Código de institución requerido');
            setIsLoading(false);
            return;
        }

        if (!formData.email.trim()) {
            setError('El email es requerido');
            setLoginStatus('error');
            setStatusMessage('Email profesional requerido');
            setIsLoading(false);
            return;
        }

        if (!formData.password.trim()) {
            setError('La contraseña es requerida');
            setLoginStatus('error');
            setStatusMessage('Contraseña requerida');
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.login(formData.email, formData.password, formData.tenantCode);

            if (result.success) {
                showLoginStatus('success', 'Acceso autorizado. Redirigiendo...');

                // Pequeño delay para mostrar el mensaje de éxito
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                setError(result.message);
                showLoginStatus('error', result.message || 'Error en las credenciales');
            }
        } catch (error) {
            const errorMsg = error.message || 'Error al iniciar sesión';
            setError(errorMsg);
            showLoginStatus('error', errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) {
            setError('');
            setLoginStatus('');
            setStatusMessage('');
        }
    };

    return (
        <MainLayout>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 pt-20 overflow-hidden">

                {/* Ondas de Sonido Médicas */}
                <div className="fixed inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        animate={{
                            scale: [1, 1.8, 1], opacity: [0.4, 0.1, 0.4],
                        }}
                        transition={{
                            duration: 3, repeat: Infinity, ease: "easeOut",
                        }}
                    >
                        <div
                            className="w-64 h-64 border-4 border-blue-400/50 rounded-full shadow-lg shadow-blue-400/20"></div>
                    </motion.div>

                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        animate={{
                            scale: [1, 2.2, 1], opacity: [0.3, 0.05, 0.3],
                        }}
                        transition={{
                            duration: 4, repeat: Infinity, ease: "easeOut", delay: 0.5,
                        }}
                    >
                        <div
                            className="w-64 h-64 border-4 border-teal-400/40 rounded-full shadow-lg shadow-teal-400/15"></div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Login Card */}
                    <div
                        className="bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div
                            className="p-8 text-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-teal-500">
                            <motion.div
                                className="flex justify-center mb-4 cursor-pointer"
                                whileHover={{scale: 1.05}}
                                transition={{type: "spring", stiffness: 400, damping: 10}}
                                onClick={() => window.location.href = '/'}
                            >
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                        <div className="flex items-end space-x-1">
                                            {[2, 4, 3, 2].map((height, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="w-1 bg-blue-600 rounded-full"
                                                    style={{height: `${height}px`}}
                                                    animate={{
                                                        height: [`${height}px`, `${height + 2}px`, `${height}px`],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: index * 0.2,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.h1
                                className="text-2xl font-bold text-white mb-2"
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: 0.2}}
                            >
                                DataVox<span className="font-light">Medical</span>
                            </motion.h1>
                            <motion.p
                                className="text-blue-100 text-sm flex items-center justify-center space-x-2"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.6, delay: 0.4}}
                            >
                                <Mic className="w-4 h-4"/>
                                <span>Plataforma de Dictado Médico Inteligente</span>
                            </motion.p>
                        </div>

                        {/* Notificación de Estado */}
                        {loginStatus && (
                            <motion.div
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className={`mx-6 mt-6 p-4 rounded-xl border ${
                                    loginStatus === 'success'
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : loginStatus === 'error'
                                            ? 'bg-red-50 border-red-200 text-red-800'
                                            : 'bg-blue-50 border-blue-200 text-blue-800'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {loginStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500"/>}
                                    {loginStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500"/>}
                                    {loginStatus === 'loading' && (
                                        <div
                                            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                                    )}
                                    <p className="font-medium text-sm">{statusMessage}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Error Message */}
                            {error && !loginStatus && (
                                <motion.div
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2"
                                >
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            {/* Tenant Code Field */}
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.6, delay: 0.1}}
                            >
                                <label htmlFor="tenantCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Building className="w-4 h-4 inline mr-2 text-blue-500"/>
                                    Código de Institución *
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="tenantCode"
                                        name="tenantCode"
                                        type="text"
                                        required
                                        value={formData.tenantCode}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                        placeholder="Ej: clinica-medellin"
                                    />
                                </div>
                            </motion.div>

                            {/* Email Field */}
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.6, delay: 0.2}}
                            >
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2 text-blue-500"/>
                                    Email Profesional *
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                        placeholder="tu.email@clinica.com"
                                    />
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.6, delay: 0.3}}
                            >
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Lock className="w-4 h-4 inline mr-2 text-blue-500"/>
                                    Contraseña *
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"/>
                                        ) : (
                                            <Eye
                                                className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"/>
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Remember Me & Forgot Password */}
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.6, delay: 0.4}}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-gray-50"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                        Recordar sesión
                                    </label>
                                </div>
                                <motion.a
                                    href="#forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium"
                                    whileHover={{scale: 1.05}}
                                >
                                    ¿Olvidó contraseña?
                                </motion.a>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center space-x-3 py-4 px-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                whileHover={!isLoading ? {
                                    scale: 1.02,
                                    boxShadow: "0 10px 30px -10px rgba(37, 99, 235, 0.4)"
                                } : {}}
                                whileTap={{scale: 0.98}}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: 0.5}}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verificando acceso...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                                        <span>Acceder a Plataforma</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.6, delay: 0.7}}
                            className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center"
                        >
                            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                                <Shield className="w-4 h-4 text-green-500"/>
                                <span className="text-sm">Plataforma certificada HIPAA</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                ¿Necesita acceso?{' '}
                                <motion.a
                                    href="/contact"
                                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                                    whileHover={{scale: 1.05}}
                                >
                                    Contacte al administrador
                                </motion.a>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default Login;