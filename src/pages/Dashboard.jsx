// src/pages/Dashboard.jsx - VERSIÓN PROFESIONAL Y MODERNA
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
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
    Layers, // Nuevo icono para estructura
    Globe, // Nuevo icono para estatus
} from 'lucide-react';
import {authService} from '../services/auth';
import AudioRecorder from '../components/AudioRecorder';

// --- Configuración de Datos (Ajuste de colores y descripciones) ---
const STATS_DATA = [
    {
        icon: FileText,
        label: 'Documentos Generados',
        value: '1,234',
        change: '+12%',
        trend: 'up',
        color: 'indigo', // Indigo en lugar de solo blue
        gradient: 'from-indigo-600 to-blue-500',
        lightGradient: 'from-indigo-50/80 to-blue-50/80',
        description: 'Métricas del último mes'
    },
    {
        icon: Users,
        label: 'Pacientes Atendidos',
        value: '892',
        change: '+8%',
        trend: 'up',
        color: 'teal', // Teal más moderno que emerald
        gradient: 'from-teal-600 to-green-500',
        lightGradient: 'from-teal-50/80 to-green-50/80',
        description: 'Consulta de última semana'
    },
    {
        icon: Activity,
        label: 'Eficiencia de Flujo',
        value: '45h',
        change: '+23%',
        trend: 'up',
        color: 'orange', // Orange más sofisticado que amber
        gradient: 'from-orange-600 to-red-500',
        lightGradient: 'from-orange-50/80 to-red-50/80',
        description: 'Tiempo ahorrado en transcripción'
    },
    {
        icon: Stethoscope,
        label: 'Dictados Procesados',
        value: '567',
        change: '+15%',
        trend: 'up',
        color: 'violet', // Violet en lugar de purple/pink
        gradient: 'from-violet-600 to-pink-500',
        lightGradient: 'from-violet-50/80 to-pink-50/80',
        description: 'Total activo en la plataforma'
    },
];

const QUICK_ACTIONS = [
    {
        title: 'Nuevo Dictado Inteligente',
        description: 'Iniciar grabación para transcripción en tiempo real.',
        icon: Mic,
        gradient: 'from-red-600 to-pink-500',
        lightGradient: 'from-red-50/80 to-pink-50/80',
        action: () => console.log('Nuevo dictado')
    },
    {
        title: 'Generar Reporte Radiológico',
        description: 'Crear informe estructurado con IA y membrete profesional.',
        icon: Scan,
        gradient: 'from-orange-600 to-amber-500',
        lightGradient: 'from-orange-50/80 to-amber-50/80',
        action: () => console.log('Generar informe')
    },
    {
        title: 'Revisar Agenda y Citas',
        description: 'Ver pacientes programados y disponibilidad de turnos.',
        icon: Calendar,
        gradient: 'from-indigo-600 to-cyan-500',
        lightGradient: 'from-indigo-50/80 to-cyan-50/80',
        action: () => console.log('Ver agenda')
    },
    {
        title: 'Exportación Masiva de Datos',
        description: 'Generar reportes analíticos y métricas del mes.',
        icon: Download,
        gradient: 'from-violet-600 to-purple-500',
        lightGradient: 'from-violet-50/80 to-purple-50/80',
        action: (setActiveSection) => setActiveSection('reports')
    },
];

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [currentTime, setCurrentTime] = useState(new Date());

    const recentActivities = [
        {action: 'Historia clínica completada - Dr. Pérez', time: 'Hace 2 min', status: 'success', icon: FileText},
        {action: 'Informe radiológico generado - Dra. García', time: 'Hace 5 min', status: 'info', icon: Scan},
        {action: 'Backup del sistema realizado', time: 'Hace 1 hora', status: 'warning', icon: Layers},
        {action: 'Nuevo usuario agregado - Dr. Rodríguez', time: 'Hace 2 horas', status: 'success', icon: Users},
    ];

    useEffect(() => {
        loadUserData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadUserData = async () => {
        try {
            // Simulación de carga de datos de usuario
            // const userInfo = await authService.getCurrentUser();
            const userInfo = {
                full_name: 'Dr. Alejandro Soto',
                email: 'alejandro.soto@clinic.com',
                role: 'Cardiólogo Especialista'
            }; // Dummy data para el ejemplo
            setUser(userInfo);
        } catch (error) {
            console.error('Error loading user data:', error);
            // authService.logout(); // Descomentar en producción
        }
    };

    const handleLogout = () => {
        // authService.logout(); // Descomentar en producción
        console.log("Logout ejecutado");
        setUser(null);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando plataforma médica avanzada...</p>
                </div>
            </div>
        );
    }

    const NavItem = ({item}) => (
        <motion.button
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                activeSection === item.id
                    ? `bg-gradient-to-r from-${item.color}-500/15 to-${item.color}-400/10 text-${item.color}-700 border border-${item.color}-200/50 shadow-lg shadow-${item.color}-500/20`
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
            }`}
            whileHover={{x: 5, scale: 1.01}}
            whileTap={{scale: 0.98}}
        >
            <div className={`p-2 rounded-lg ${
                activeSection === item.id
                    ? `bg-gradient-to-r from-${item.color}-600 to-${item.color}-500 text-white shadow-xl shadow-${item.color}-500/30`
                    : 'bg-white/80 text-gray-500 group-hover:bg-gray-100 group-hover:shadow-md'
            } transition-all duration-300 backdrop-blur-sm`}>
                <item.icon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">{item.label}</span>
        </motion.button>
    );

    const StatCard = ({stat, index}) => (
        <motion.div
            initial={{opacity: 0, y: 30, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.6, delay: index * 0.1}}
            className="group cursor-pointer h-full"
            whileHover={{y: -5, scale: 1.02}}
        >
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden h-full">
                {/* Subtle Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-50`}></div>

                {/* Animated Ring on Hover */}
                <motion.div
                    className={`absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-transparent group-hover:border-${stat.color}-400/50 transition-all duration-500`}
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/30 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
                            <stat.icon className="w-6 h-6 text-white"/>
                        </div>
                        <motion.div
                            className={`flex items-center space-x-1 text-sm font-bold ${
                                stat.trend === 'up' ? 'text-teal-600' : 'text-red-600'
                            } bg-white/90 px-2 py-1 rounded-full border border-gray-100 backdrop-blur-sm`}
                            whileHover={{scale: 1.1}}
                        >
                            <TrendingUp className="w-4 h-4"/>
                            <span>{stat.change}</span>
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {stat.value}
                        </h3>
                        <p className="text-gray-900 font-semibold mb-1">{stat.label}</p>
                        <p className="text-gray-600 text-sm">{stat.description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const QuickActionButton = ({action, index}) => (
        <motion.button
            key={action.title}
            onClick={() => action.action(setActiveSection)}
            whileHover={{scale: 1.03, y: -3}}
            whileTap={{scale: 0.98}}
            className={`p-6 bg-white/70 backdrop-blur-xl rounded-2xl text-left group transition-all duration-500 shadow-2xl hover:shadow-3xl relative overflow-hidden border border-gray-200/50`}
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: index * 0.1}}
        >
            {/* Subtle Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.lightGradient} opacity-50`}></div>

            {/* Icon and Text */}
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-xl shadow-gray-500/20 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
                    <action.icon className="w-6 h-6 text-white"/>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    {action.title}
                </h4>
                <p className="text-gray-600 text-sm leading-snug">
                    {action.description}
                </p>
            </div>
        </motion.button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/50 to-indigo-50/30 text-gray-900 flex">
            {/* 1. Sidebar Navigation */}
            <motion.div
                initial={{x: -100, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="w-72 bg-white/70 backdrop-blur-2xl shadow-2xl border-r border-gray-200/40 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-200/40 bg-gradient-to-r from-white/90 to-gray-50/70">
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => setActiveSection('overview')}
                        whileHover={{scale: 1.02}}
                        transition={{type: "spring", stiffness: 400, damping: 10}}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-300">
                            <Stethoscope className="w-5 h-5 text-white"/>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 to-teal-600 bg-clip-text text-transparent">
                                DataVox<span className="font-light">Med</span>
                            </span>
                            <p className="text-xs text-gray-500 font-medium tracking-wider">A.I. Platform</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-5 space-y-2">
                    {[
                        {id: 'overview', label: 'Panel Principal', icon: BarChart3, color: 'indigo'},
                        {id: 'recordings', label: 'Dictados Inteligentes', icon: Mic, color: 'red'},
                        {id: 'patients', label: 'Gestión de Pacientes', icon: Users, color: 'teal'},
                        {id: 'reports', label: 'Reportes y Analíticas', icon: FileText, color: 'orange'},
                        {id: 'schedule', label: 'Agenda de Consultas', icon: Calendar, color: 'violet'},
                    ].map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-5 border-t border-gray-200/40 bg-gradient-to-b from-white/60 to-gray-50/40">
                    <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-gray-200/40 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer backdrop-blur-md">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300">
                                <span className="text-white font-semibold text-sm">
                                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {user.full_name || user.email}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                {user.role || 'Médico Especialista'}
                            </p>
                        </div>
                        <Settings className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                </div>
            </motion.div>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/40">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {{
                                    overview: 'Panel de Control (Dashboard)',
                                    recordings: 'Sistema de Dictado Inteligente',
                                    patients: 'Gestión de Pacientes',
                                    reports: 'Reportes y Analíticas Clínicas',
                                    schedule: 'Agenda Médica'
                                }[activeSection]}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="font-semibold">{getGreeting()}, {user.full_name?.split(' ')[0] || 'Colega'}</span>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center space-x-1 bg-white/50 px-2 py-1 rounded-full text-indigo-600 font-medium backdrop-blur-sm shadow-sm">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{currentTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-teal-600 font-medium bg-teal-50/70 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                                    <Globe className="w-3.5 h-3.5"/>
                                    <span className="text-xs">{getDailyMetrics()}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                                <input
                                    type="text"
                                    placeholder="Buscar documentos, pacientes..."
                                    className="pl-10 pr-4 py-2.5 bg-white/90 border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all duration-300 w-64 backdrop-blur-sm text-sm shadow-sm"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    className="p-3 text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:bg-indigo-50/80 rounded-xl relative backdrop-blur-sm border border-gray-200/50 shadow-sm"
                                >
                                    <Bell className="w-5 h-5"/>
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                                </motion.button>

                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-gray-500/25 backdrop-blur-sm text-sm"
                                >
                                    <LogOut className="w-4 h-4"/>
                                    <span>Salir</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-auto">
                    {activeSection === 'overview' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.6}}
                            className="space-y-8"
                        >
                            {/* Welcome Section (Optimized for visual appeal) */}
                            <div className="relative overflow-hidden rounded-3xl">
                                <div className="bg-gradient-to-r from-indigo-600/95 via-indigo-700/95 to-teal-600/95 rounded-3xl p-8 lg:p-10 text-white shadow-2xl shadow-indigo-500/30 backdrop-blur-md">
                                    {/* Abstract Background Design */}
                                    <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `radial-gradient(circle at 10% 90%, white 1px, transparent 0)`,
                                            backgroundSize: '80px 80px'
                                        }}></div>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex-1">
                                            <motion.div
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                transition={{duration: 0.6, delay: 0.2}}
                                            >
                                                <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                                                    {getGreeting()}, Dr. {user.full_name?.split(' ')[0] || 'Colega'}
                                                </h2>
                                                <p className="text-indigo-100 text-lg mb-4 leading-relaxed max-w-xl">
                                                    Plataforma operativa al <span className="font-bold text-teal-200">100%</span>. Su productividad es nuestra prioridad.
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                                                        <Zap className="w-4 h-4 text-teal-300" />
                                                        <span className="text-teal-100 font-medium">Rendimiento Óptimo</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                                                        <Sparkles className="w-4 h-4 text-amber-300" />
                                                        <span className="text-amber-100 font-medium">IA Asistida</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            className="flex-shrink-0 hidden md:block"
                                            animate={{
                                                y: [0, -8, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
                                                <HeartPulse className="w-14 h-14 text-white animate-pulse" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {STATS_DATA.map((stat, index) => (
                                    <StatCard key={stat.label} stat={stat} index={index} />
                                ))}
                            </div>

                            {/* Quick Actions & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                                {/* Quick Actions */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Acciones Clave
                                        </h3>
                                        <motion.div
                                            className="flex items-center space-x-2 text-sm text-indigo-600 bg-indigo-50/70 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold shadow-sm border border-indigo-200/50"
                                            whileHover={{scale: 1.05}}
                                        >
                                            <Zap className="w-4 h-4" />
                                            <span>Productividad</span>
                                        </motion.div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {QUICK_ACTIONS.map((action, index) => (
                                            <QuickActionButton key={action.title} action={action} index={index} />
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Línea de Tiempo
                                        </h3>
                                        <motion.div
                                            className="flex items-center space-x-2 text-sm text-teal-600 bg-teal-50/70 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold shadow-sm border border-teal-200/50"
                                            whileHover={{scale: 1.05}}
                                        >
                                            <ActivityIcon className="w-4 h-4" />
                                            <span>Actividad en vivo</span>
                                        </motion.div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 shadow-2xl">
                                        <div className="space-y-4">
                                            {recentActivities.map((activity, index) => {
                                                const Icon = activity.icon;
                                                const statusColor = activity.status === 'success' ? 'teal' :
                                                    activity.status === 'info' ? 'indigo' :
                                                        activity.status === 'warning' ? 'orange' : 'red';
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{opacity: 0, x: -10}}
                                                        animate={{opacity: 1, x: 0}}
                                                        transition={{duration: 0.4, delay: index * 0.1}}
                                                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/90 transition-all duration-300 group cursor-pointer backdrop-blur-sm border border-transparent hover:border-gray-100"
                                                        whileHover={{x: 3, scale: 1.01}}
                                                    >
                                                        <div className={`p-2 rounded-full bg-gradient-to-br from-${statusColor}-500 to-${statusColor}-400 shadow-lg shadow-${statusColor}-500/20 flex-shrink-0`}>
                                                            <Icon className="w-4 h-4 text-white"/>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-900 text-sm font-semibold leading-snug group-hover:text-indigo-600 transition-colors">
                                                                {activity.action}
                                                            </p>
                                                            <p className="text-gray-500 text-xs mt-1">
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        <motion.button
                                            className="w-full mt-6 py-3 text-gray-600 hover:text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50/50 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 hover:border-indigo-200/50 shadow-sm"
                                            whileHover={{scale: 1.01, y: -1}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            Ver Historial Detallado
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'recordings' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.6}}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Módulo de Dictado Médico AI</h2>
                            <AudioRecorder/>
                            <p className="mt-6 text-gray-600 text-sm">
                                Utilice el micrófono para iniciar una transcripción médica en tiempo real, asistida por inteligencia artificial.
                            </p>
                        </motion.div>
                    )}

                    {activeSection === 'patients' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.6}}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-2xl text-center"
                        >
                            <Users className="w-12 h-12 text-indigo-500 mx-auto mb-4"/>
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">Gestión Avanzada de Pacientes</h2>
                            <p className="text-gray-600 max-w-lg mx-auto">
                                Esta sección incluirá herramientas CRM para la gestión de expedientes, historial clínico digital, y seguimiento de tratamientos. (En desarrollo: Componente de Tabla/Filtros).
                            </p>
                            <motion.button
                                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                                whileHover={{scale: 1.05}}
                            >
                                Iniciar Búsqueda de Expediente
                            </motion.button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;