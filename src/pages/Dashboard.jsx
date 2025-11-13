// src/pages/Dashboard.jsx - VERSIÓN NEUMÓRFICA Y PROFESIONAL

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Stethoscope,
    FileText,
    Users,
    Activity,
    LogOut,
    Mic,
    Calendar,
    Download,
    BarChart3,
    Settings,
    Bell,
    Search,
    Clock,
    CheckCircle,
    TrendingUp,
    Zap,
    Sparkles,
    HeartPulse,
    Scan,
    ActivityIcon,
    ClipboardList,
    Shield,
    FileSearch
} from 'lucide-react';
import { authService } from '../services/auth';
import AudioRecorder from '../components/AudioRecorder'; // Asumo que este componente existe

// Función de utilidad para generar clases de degradado y neumorfismo consistente
const getGradientClasses = (color, type = 'card') => {
    const gradients = {
        blue: {
            main: 'from-blue-600 to-cyan-500',
            light: 'from-blue-100/70 to-cyan-50/50',
            text: 'from-blue-700 to-cyan-600',
            shadow: 'shadow-blue-200/50',
            hover: 'shadow-blue-300/60'
        },
        red: {
            main: 'from-red-600 to-pink-500',
            light: 'from-red-100/70 to-pink-50/50',
            text: 'from-red-700 to-pink-600',
            shadow: 'shadow-red-200/50',
            hover: 'shadow-red-300/60'
        },
        emerald: {
            main: 'from-emerald-600 to-green-500',
            light: 'from-emerald-100/70 to-green-50/50',
            text: 'from-emerald-700 to-green-600',
            shadow: 'shadow-emerald-200/50',
            hover: 'shadow-emerald-300/60'
        },
        amber: {
            main: 'from-amber-600 to-orange-500',
            light: 'from-amber-100/70 to-orange-50/50',
            text: 'from-amber-700 to-orange-600',
            shadow: 'shadow-amber-200/50',
            hover: 'shadow-amber-300/60'
        },
        purple: {
            main: 'from-purple-600 to-pink-500',
            light: 'from-purple-100/70 to-pink-50/50',
            text: 'from-purple-700 to-pink-600',
            shadow: 'shadow-purple-200/50',
            hover: 'shadow-purple-300/60'
        },
        indigo: {
            main: 'from-indigo-600 to-purple-500',
            light: 'from-indigo-100/70 to-purple-50/50',
            text: 'from-indigo-700 to-purple-600',
            shadow: 'shadow-indigo-200/50',
            hover: 'shadow-indigo-300/60'
        },
        // Nuevo color para la actividad reciente
        gray: {
            main: 'from-gray-600 to-gray-500',
            light: 'from-gray-50/70 to-gray-100/50',
            text: 'from-gray-700 to-gray-600',
            shadow: 'shadow-gray-200/50',
            hover: 'shadow-gray-300/60'
        }
    };

    const colorClasses = gradients[color] || gradients.gray;

    if (type === 'card') {
        return {
            gradient: `bg-gradient-to-br ${colorClasses.main}`,
            lightGradient: `bg-gradient-to-br ${colorClasses.light}`,
            textGradient: `bg-gradient-to-r ${colorClasses.text} bg-clip-text text-transparent`,
            shadow: `shadow-lg ${colorClasses.shadow} hover:${colorClasses.hover}`
        };
    } else if (type === 'nav') {
        return {
            activeBg: `bg-gradient-to-r ${colorClasses.light} border border-${color}-200/60`,
            activeText: `text-${color}-700`,
            iconBg: `bg-gradient-to-br ${colorClasses.main}`
        };
    } else if (type === 'action') {
        return {
            iconBg: `bg-gradient-to-br ${colorClasses.main}`,
            hoverBorder: `border-${color}-300/50`,
            text: `text-${color}-700`,
            shadow: `${colorClasses.shadow}`
        };
    }

    return {};
};


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Datos de ejemplo actualizados
    const [stats, setStats] = useState([
        {
            icon: FileText,
            label: 'Documentos Generados',
            value: '1,234',
            change: '+12%',
            trend: 'up',
            color: 'blue',
            description: 'Este mes'
        },
        {
            icon: Users,
            label: 'Pacientes Atendidos',
            value: '892',
            change: '+8%',
            trend: 'up',
            color: 'emerald',
            description: 'Última semana'
        },
        {
            icon: Activity,
            label: 'Tiempo Ahorrado',
            value: '45h',
            change: '+23%',
            trend: 'up',
            color: 'amber',
            description: 'vs. mes anterior'
        },
        {
            icon: Shield,
            label: 'Nivel de Seguridad',
            value: '99.9%',
            change: '0%',
            trend: 'stable',
            color: 'purple',
            description: 'Cumplimiento HIPAA'
        },
    ]);

    const recentActivities = [
        { action: 'Historia clínica completada - Dr. Pérez', time: 'Hace 2 min', status: 'success', type: 'document', icon: FileText },
        { action: 'Informe radiológico generado - Dra. García', time: 'Hace 5 min', status: 'info', type: 'report', icon: Scan },
        { action: 'Backup del sistema realizado', time: 'Hace 1 hora', status: 'warning', type: 'system', icon: Shield },
        { action: 'Nuevo usuario agregado - Dr. Rodríguez', time: 'Hace 2 horas', status: 'success', type: 'user', icon: Users },
    ];

    const quickActions = [
        {
            title: 'Nuevo Dictado',
            description: 'Iniciar grabación médica ahora',
            icon: Mic,
            color: 'red',
            action: () => setActiveSection('recordings')
        },
        {
            title: 'Informe Radiológico',
            description: 'Generar nuevo informe con IA',
            icon: Scan,
            color: 'amber',
            action: () => console.log('Generar informe')
        },
        {
            title: 'Agenda Médica',
            description: 'Ver pacientes programados',
            icon: Calendar,
            color: 'blue',
            action: () => console.log('Ver agenda')
        },
        {
            title: 'Buscar Documento',
            description: 'Búsqueda avanzada de historial',
            icon: FileSearch,
            color: 'indigo',
            action: () => setActiveSection('reports')
        },
    ];

    useEffect(() => {
        loadUserData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadUserData = async () => {
        try {
            // Simulación de carga de datos (deberías tener tu lógica real aquí)
            const userInfo = { full_name: 'Fernando Pérez', email: 'dr.perez@datavox.com', role: 'Cardiólogo' }; // Simulación
            setUser(userInfo);
        } catch (error) {
            console.error('Error loading user data:', error);
            // authService.logout(); // Descomentar en producción
        }
    };

    const handleLogout = () => {
        // authService.logout(); // Descomentar en producción
        console.log('Cerrando Sesión...');
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const getDailyMetrics = () => {
        const metrics = [
            '5 dictados pendientes de revisión',
            '12 documentos generados hoy',
            '3 informes radiológicos completados',
            '98% de precisión en transcripciones',
            'Sistema operando al 100%'
        ];
        return metrics[Math.floor(Math.random() * metrics.length)];
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando plataforma médica...</p>
                </div>
            </div>
        );
    }

    // Componente de Carta de Estadística Reutilizable
    const StatCard = ({ stat, index }) => {
        const { icon: Icon, label, value, change, trend, color, description } = stat;
        const { gradient, lightGradient, shadow, textGradient } = getGradientClasses(color, 'card');

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer h-full"
                whileHover={{ y: -5, scale: 1.02 }}
            >
                <div className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl transition-all duration-300 border border-gray-100/70 hover:shadow-2xl hover:${shadow} h-full`}>
                    <div className={`absolute inset-0 rounded-2xl ${lightGradient} opacity-50 transition-opacity duration-300`}></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${gradient} shadow-lg transition-all duration-300`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                className={`flex items-center space-x-1 text-sm font-bold ${
                                    trend === 'up' ? 'text-emerald-500 bg-emerald-50/70' :
                                        trend === 'stable' ? 'text-blue-500 bg-blue-50/70' :
                                            'text-red-500 bg-red-50/70'
                                } px-3 py-1.5 rounded-full backdrop-blur-sm`}
                                whileHover={{ scale: 1.1 }}
                            >
                                <TrendingUp className={`w-4 h-4 ${trend === 'stable' ? 'rotate-90 text-blue-500' : ''}`} />
                                <span>{change}</span>
                            </motion.div>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {value}
                            </h3>
                            <p className="text-gray-900 font-semibold mb-1 leading-snug">{label}</p>
                            <p className="text-gray-500 text-xs">{description}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50/70 text-gray-900 flex font-sans antialiased">
            {/* Sidebar Navigation */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-64 bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-200/50 border-r border-gray-200/50 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-100/70">
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => setActiveSection('overview')}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                                DataVox<span className="font-semibold">AI</span>
                            </span>
                            <p className="text-xs text-gray-500 font-medium">Plataforma Médica</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'overview', label: 'Resumen General', icon: BarChart3, color: 'blue' },
                        { id: 'recordings', label: 'Dictados Médicos', icon: Mic, color: 'red' },
                        { id: 'patients', label: 'Gestión de Pacientes', icon: Users, color: 'emerald' },
                        { id: 'reports', label: 'Reportes Clínicos', icon: ClipboardList, color: 'amber' },
                        { id: 'schedule', label: 'Agenda Médica', icon: Calendar, color: 'indigo' },
                    ].map((item) => {
                        const { activeBg, activeText, iconBg } = getGradientClasses(item.color, 'nav');
                        const isActive = activeSection === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                                    isActive
                                        ? `${activeBg} ${activeText} shadow-lg shadow-${item.color}-500/10 font-bold`
                                        : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 font-medium'
                                }`}
                                whileHover={{ x: 3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`p-2 rounded-lg ${
                                    isActive
                                        ? `${iconBg} text-white shadow-md shadow-${item.color}-500/30`
                                        : 'bg-white text-gray-500 group-hover:bg-white/50 group-hover:shadow-sm'
                                } transition-all duration-300`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-100/70 bg-white/70">
                    <div className="flex items-center space-x-3 p-3 bg-white/90 rounded-xl border border-gray-200/50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-semibold text-sm">
                                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.full_name || user.email}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                {user.role || 'Médico Especialista'}
                            </p>
                        </div>
                        <Settings className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-100/50 border-b border-gray-200/50 sticky top-0 z-20">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {{
                                    overview: 'Panel Médico Principal',
                                    recordings: 'Sistema de Dictado Inteligente',
                                    patients: 'Gestión de Expedientes Clínicos',
                                    reports: 'Reportes y Documentación AI',
                                    schedule: 'Agenda Médica Integrada'
                                }[activeSection]}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="font-medium text-gray-700">{getGreeting()}, Dr. {user.full_name?.split(' ')[0] || 'Colega'}</span>
                                <span className="text-gray-400">•</span>
                                <span className="flex items-center space-x-1 bg-white/70 px-2.5 py-1 rounded-full border border-gray-200/70">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <span className="font-medium text-gray-700">{currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>

                                    <span className="text-gray-400 mx-2">|</span>
                                    <span className="text-emerald-600 font-semibold bg-emerald-50/70 px-2 py-0.5 rounded-full text-xs flex items-center space-x-1">
                                        <Zap className="w-3 h-3" />
                                        <span>Operativo</span>
                                    </span>
                                </span>
                                <span className="hidden sm:inline text-sm text-gray-500 font-medium">{getDailyMetrics()}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Search */}
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                                <input
                                    type="text"
                                    placeholder="Buscar pacientes, documentos..."
                                    className="pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 w-64 shadow-inner shadow-gray-100/50"
                                />
                            </motion.div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/70 text-gray-600 hover:text-blue-600 transition-colors duration-300 rounded-xl relative border border-gray-200/80 shadow-md shadow-gray-100/50"
                                >
                                    <Bell className="w-5 h-5"/>
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/70 text-gray-600 hover:text-blue-600 transition-colors duration-300 rounded-xl border border-gray-200/80 shadow-md shadow-gray-100/50"
                                >
                                    <Settings className="w-5 h-5"/>
                                </motion.button>

                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(59, 130, 246, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-blue-500/30"
                                >
                                    <LogOut className="w-4 h-4"/>
                                    <span className="text-sm">Salir</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-auto">
                    {activeSection === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            {/* Welcome Section */}
                            <div className="relative overflow-hidden rounded-3xl">
                                <div className="bg-gradient-to-r from-blue-700/95 via-blue-800/95 to-cyan-700/95 rounded-3xl p-10 text-white shadow-2xl shadow-blue-500/30 backdrop-blur-sm">
                                    {/* Background Subtle Pattern */}
                                    <div className="absolute inset-0 opacity-[0.05]">
                                        <svg width="100%" height="100%">
                                            <defs>
                                                <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <circle cx="1" cy="1" r="1" fill="white" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#dotPattern)" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex-1">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: 0.2 }}
                                            >
                                                <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                                                    {getGreeting()}, Dr. {user.full_name?.split(' ')[0] || 'Colega'}!
                                                </h2>
                                                <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                                                    Su **Panel de Gestión Clínica** ha sido optimizado con IA.
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors hover:bg-white/30">
                                                        <Zap className="w-4 h-4 text-cyan-300" />
                                                        <span className="text-cyan-100 font-medium">Rendimiento IA: Óptimo</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            className="flex-shrink-0 hidden sm:block"
                                            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl shadow-black/20">
                                                <Stethoscope className="w-14 h-14 text-white" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <StatCard key={stat.label} stat={stat} index={index} />
                                ))}
                            </div>

                            {/* Quick Actions & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                                {/* Quick Actions */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Acciones Rápidas
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/50 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-gray-200/50">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            <span className="font-medium">Flujo de Trabajo AI</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {quickActions.map((action, index) => {
                                            const { icon: Icon, title, description, color } = action;
                                            const { iconBg, hoverBorder, text, shadow } = getGradientClasses(color, 'action');

                                            return (
                                                <motion.button
                                                    key={title}
                                                    onClick={action.action}
                                                    whileHover={{ scale: 1.03, y: -3, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-6 bg-white/90 backdrop-blur-lg rounded-2xl text-left group transition-all duration-300 shadow-xl shadow-gray-200/50 relative border border-gray-100/70 hover:border-transparent hover:${hoverBorder} hover:${shadow}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                                >
                                                    <div className="relative z-10">
                                                        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-4 shadow-xl group-hover:scale-105 transition-all duration-300 shadow-${color}-500/30`}>
                                                            <Icon className="w-6 h-6 text-white"/>
                                                        </div>
                                                        <h4 className={`font-bold text-gray-900 text-lg mb-2 group-hover:${text} transition-colors duration-300`}>
                                                            {title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Registro de Actividad
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/50 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-gray-200/50">
                                            <ActivityIcon className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium">Últimas 24h</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100/70 p-6 shadow-xl shadow-gray-200/50">
                                        <div className="space-y-4">
                                            {recentActivities.map((activity, index) => {
                                                const Icon = activity.icon;
                                                const statusColor = activity.status === 'success' ? 'text-emerald-500' :
                                                    activity.status === 'info' ? 'text-blue-500' :
                                                        activity.status === 'warning' ? 'text-amber-500' : 'text-red-500';

                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-100/70 transition-all duration-300 group cursor-pointer border-l-4 border-transparent hover:border-blue-500/50"
                                                        whileHover={{ x: 5, scale: 1.01 }}
                                                    >
                                                        <Icon className={`w-5 h-5 ${statusColor} flex-shrink-0`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-900 text-sm font-semibold leading-relaxed truncate">
                                                                {activity.action}
                                                            </p>
                                                            <p className="text-gray-500 text-xs mt-0.5">
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                        <motion.div
                                                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            <HeartPulse className="w-4 h-4" />
                                                        </motion.div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        <motion.button
                                            className="w-full mt-6 py-3 text-blue-600 hover:text-white transition-colors font-semibold rounded-xl bg-blue-50/50 hover:bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Ver historial completo
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Contenido para grabaciones (micrófono) */}
                    {activeSection === 'recordings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="p-8 bg-white/80 rounded-2xl shadow-2xl border border-gray-100/70"
                        >
                            <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                                🎙️ Dictado Médico Inteligente
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Inicie una grabación para generar automáticamente una transcripción y un resumen clínico.
                            </p>
                            <AudioRecorder/>
                        </motion.div>
                    )}

                    {/* Contenido genérico para otras secciones */}
                    {activeSection !== 'overview' && activeSection !== 'recordings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="p-8 bg-white/80 rounded-2xl shadow-2xl border border-gray-100/70 h-[500px] flex items-center justify-center"
                        >
                            <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700">
                                    Sección "{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}" en Construcción
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    Aquí irá la interfaz de gestión de **{{
                                    patients: 'Pacientes',
                                    reports: 'Reportes Clínicos',
                                    schedule: 'Agenda Médica'
                                }[activeSection]}**.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;