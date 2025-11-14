// src/pages/Dashboard.jsx - VERSIÓN ULTRA-MODERNA (SOFT UI / LIGHT GLASSMORHPISM)
import React, {useState, useEffect, useRef} from 'react'; // <-- Aseguramos useRef
import {motion} from 'framer-motion';
import {
    Stethoscope, FileText, Users, Activity, LogOut, Mic, Calendar, Download, Settings, Bell,
    Clock, CheckCircle, TrendingUp, Brain, Zap, Sparkles, HeartPulse, Scan, ActivityIcon,
    BarChart3, MessageSquare, ShieldCheck, Grid, TrendingDown
} from 'lucide-react';
import {authService} from '../services/auth';
import {dashboardService} from '../services/dashboard';
import AudioRecorder from '../components/AudioRecorder';
import Reports from './Reports';
import Patients from './Patients';
import Schedule from './Schedule';
import DocumentView from './DocumentView';
// NUEVOS HOOKS Y COMPONENTES
import useNotification from '../hooks/useNotification';
import NotificationToast from '../components/ui/NotificationToast';


// --- Componentes Reutilizables de Estilo ---
// (getGradientClasses, NavItem - Se mantienen intactos)
const getGradientClasses = (color) => {
    switch (color) {
        case 'blue': return {bg: 'from-sky-500 to-indigo-500', text: 'text-sky-600', hoverBg: 'from-sky-500/10 to-indigo-500/10', lightBg: 'bg-sky-50/70'};
        case 'red': return {bg: 'from-red-500 to-pink-500', text: 'text-red-600', hoverBg: 'from-red-500/10 to-pink-500/10', lightBg: 'bg-red-50/70'};
        case 'emerald': return {bg: 'from-emerald-500 to-green-500', text: 'text-emerald-600', hoverBg: 'from-emerald-500/10 to-green-500/10', lightBg: 'bg-emerald-50/70'};
        case 'amber': return {bg: 'from-amber-500 to-orange-500', text: 'text-amber-600', hoverBg: 'from-amber-500/10 to-orange-500/10', lightBg: 'bg-amber-50/70'};
        case 'purple': return {bg: 'from-purple-500 to-indigo-500', text: 'text-purple-600', hoverBg: 'from-purple-500/10 to-indigo-500/10', lightBg: 'bg-purple-50/70'};
        default: return {bg: 'from-gray-600 to-gray-700', text: 'text-gray-600', hoverBg: 'from-gray-600/10 to-gray-700/10', lightBg: 'bg-gray-100/70'};
    }
};

const NavItem = ({icon: Icon, label, active, onClick, color}) => {
    const {bg, text, hoverBg} = getGradientClasses(color);
    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group
                ${active
                // Estilo activo suave y claro
                ? `bg-gradient-to-r ${hoverBg} ${text} border border-indigo-200/50 shadow-lg shadow-indigo-100 font-semibold`
                : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 font-medium'
            }`}
            whileHover={{x: 5, scale: 1.03}}
            whileTap={{scale: 0.98}}
        >
            <div className={`p-2 rounded-lg transition-all duration-300
                ${active
                ? `bg-gradient-to-br ${bg} text-white shadow-xl shadow-indigo-500/25`
                : 'bg-white/80 text-gray-500 group-hover:bg-gray-100 group-hover:shadow-md'
            }`}>
                <Icon className="w-5 h-5"/>
            </div>
            <span className="text-base">{label}</span>
        </motion.button>
    );
};
// --- FIN Componentes Reutilizables de Estilo ---


// --- Dashboard Component ---
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [documentViewId, setDocumentViewId] = useState(null);

    // CORRECCIÓN: Desestructurar TODAS las funciones del hook de notificaciones
    const { notifications, removeNotification, error, success, system, info, ai, warning } = useNotification();

    // NUEVO: Bandera para controlar la primera carga del Dashboard
    const isInitialMount = useRef(true);


    // Datos de Estadísticas - Ahora realimenta de loadDashboardMetrics
    const [stats, setStats] = useState([
        {icon: FileText, label: 'Docs. Generados', value: '0', change: '0%', trend: 'up', color: 'blue', gradient: 'from-sky-500 to-indigo-500', lightGradient: 'from-sky-100/60 to-indigo-100/60', description: 'Cargando...'},
        {icon: Users, label: 'Pacientes Activos', value: '0', change: '0%', trend: 'up', color: 'emerald', gradient: 'from-emerald-500 to-green-500', lightGradient: 'from-emerald-100/60 to-green-100/60', description: 'Cargando...'},
        {icon: Clock, label: 'Tiempo Ahorrado', value: '0h', change: '0%', trend: 'up', color: 'amber', gradient: 'from-amber-500 to-orange-500', lightGradient: 'from-amber-100/60 to-orange-100/60', description: 'Cargando...'},
        {icon: Mic, label: 'Dictados Procesados', value: '0', change: '0%', trend: 'up', color: 'purple', gradient: 'from-purple-500 to-indigo-500', lightGradient: 'from-purple-100/60 to-indigo-100/60', description: 'Cargando...'},
    ]);

    const [recentActivities, setRecentActivities] = useState([]);
    const [dailyMetricsStatus, setDailyMetricsStatus] = useState("Sistema operando al 100%");


    const quickActions = [
        {title: 'Nuevo Dictado', description: 'Iniciar grabación médica', icon: Mic, color: 'red', action: () => setActiveSection('recordings')},
        {title: 'Reportes Clínicos', description: 'Ver historiales y reportes', icon: FileText, color: 'amber', action: () => setActiveSection('reports')},
        {title: 'Gestión de Pacientes', description: 'Ver pacientes programados', icon: Users, color: 'emerald', action: () => setActiveSection('patients')},
        {title: 'Agenda Médica', description: 'Ver citas diarias', icon: Calendar, color: 'blue', action: () => setActiveSection('schedule')},
    ];

    useEffect(() => {
        loadUserData();
        loadDashboardMetrics();
        isInitialMount.current = false; // El montaje inicial ha terminado
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadUserData = async () => {
        try {
            const userInfo = await authService.getCurrentUser();
            const mockUser = userInfo || { full_name: 'Dr. Andrés C.', role: 'Médico Especialista' };
            setUser({
                ...mockUser,
                full_name: mockUser.full_name || 'Dr. Médico',
                role: mockUser.role || 'Especialista',
                initials: (mockUser.full_name || 'DM').split(' ').map(n => n[0]).join('').toUpperCase()
            });
        } catch (err) {
            console.error('Error loading user data:', err);
            error('Error al cargar datos de usuario. Intente reconectar.', 8000);
            setUser({ full_name: 'Usuario Invitado', role: 'Visitante', initials: 'UI' });
        }
    };

    const loadDashboardMetrics = async () => {
        try {
            const apiMetrics = await dashboardService.getMetrics();

            const mapMetric = (statConfig, apiData) => {
                const trendStr = apiData.trend;
                const trend = trendStr.startsWith('+') ? 'up' : (trendStr.startsWith('-') ? 'down' : 'up');

                return {
                    ...statConfig,
                    value: apiData.count.toLocaleString('es-ES'),
                    change: trendStr,
                    trend: trend,
                    description: apiData.description,
                };
            };

            setStats(prevStats => [
                mapMetric(prevStats[0], apiMetrics.documents_generated),
                mapMetric(prevStats[1], apiMetrics.patients_served),
                mapMetric(prevStats[2], apiMetrics.time_saved),
                mapMetric(prevStats[3], apiMetrics.recordings_processed),
            ]);

            const pendingRevisionDesc = apiMetrics.recordings_processed.description;
            const todayDocsCount = apiMetrics.documents_generated.count;

            setDailyMetricsStatus(`Actividad: ${todayDocsCount} docs. hoy. ${pendingRevisionDesc}`);

            setRecentActivities([
                {action: `Documentos generados hoy: ${todayDocsCount} informes.`, time: 'Ahora', status: 'success'},
                {action: `Dictados pendientes de revisar: ${pendingRevisionDesc.split(' ')[0]}`, time: 'Ahora', status: 'warning'},
            ]);

            // CORRECCIÓN: Solo notificar si NO es la carga inicial
            if (!isInitialMount.current) {
                system('Métricas actualizadas. Sistema Estable.', 3000);
            }

        } catch (err) {
            console.error('Error loading dashboard metrics:', err);
            // CORRECCIÓN: Solo notificar si NO es la carga inicial
            if (!isInitialMount.current) {
                error('No se pudo conectar al sistema de métricas. Intente más tarde.', 8000);
            }

            setStats(prevStats => prevStats.map(stat => ({
                ...stat,
                value: 'Error',
                change: 'N/A',
                trend: 'down',
                description: 'Error al cargar datos'
            })));
            setDailyMetricsStatus("Error: Conexión de métricas fallida.");
            setRecentActivities([]);
        }
    };

    const handleLogout = () => {
        console.log("Cerrando Sesión...");
        authService.logout();
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    // Función para manejar la vista del documento
    const handleViewDocument = (id) => {
        setDocumentViewId(id);
        setActiveSection('reports');
    };

    const handleBackToReports = () => {
        setDocumentViewId(null);
    };


    const renderContent = () => {
        // Objeto de notificaciones para pasar a los hijos
        const childNotifications = { error, success, info, ai, warning };

        // PRIORIDAD 1: Si hay un ID de documento, mostrar la vista individual
        if (documentViewId) {
            return <DocumentView documentId={documentViewId} onBack={handleBackToReports} notifications={childNotifications} />;
        }

        // PRIORIDAD 2: Mostrar la sección normal
        switch (activeSection) {
            case 'overview':
                return renderOverview();
            case 'recordings':
                return <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🎙️ Sistema de Grabación y Transcripción Inteligente</h2>
                    {/* Pasamos notificaciones al AudioRecorder */}
                    <AudioRecorder notifications={childNotifications} />
                    <div className="mt-8 p-4 bg-blue-50/50 rounded-xl flex items-center space-x-3 border border-blue-200/50">
                        <Brain className="w-5 h-5 text-indigo-600"/>
                        <p className="text-sm text-gray-700 font-medium">Las grabaciones se procesan con **Inteligencia Artificial** para una transcripción y estructuración automática de informes clínicos.</p>
                    </div>
                </motion.div>;
            case 'patients':
                // Pasamos notificaciones a Patients
                return <Patients notifications={childNotifications} />;
            case 'reports':
                // Si la sección es reports pero documentViewId es null, muestra la lista.
                // Pasamos la función de vista y las notificaciones a Reports
                return <Reports onViewDocument={handleViewDocument} notifications={childNotifications} />;
            case 'schedule':
                // Pasamos notificaciones a Schedule
                return <Schedule notifications={childNotifications} />;
            default:
                return renderOverview();
        }
    };

    const renderOverview = () => (
        <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, ease: "easeOut"}}
            className="space-y-8"
        >
            {/* Welcome Section - Banner */}
            <motion.div
                className="relative overflow-hidden rounded-3xl"
                initial={{y: 20}}
                animate={{y: 0}}
                transition={{type: "spring", stiffness: 100, delay: 0.1}}
            >
                <div className="p-8 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-2xl shadow-indigo-500/50">
                    {/* Patrón de Fondo Abstracto */}
                    <div className="absolute inset-0 opacity-[0.05] bg-repeat" style={{backgroundImage: `radial-gradient(circle at 10% 10%, white 1px, transparent 0)`, backgroundSize: '30px 30px'}}></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold mb-2 text-white">
                                ¡{getGreeting()}, Dr. {user.full_name?.split(' ')[0] || 'Colega'}!
                            </h2>
                            <p className="text-indigo-200 text-lg mb-4 leading-relaxed">
                                **Optimice su jornada.** Su panel central de **DataVoxMedical** le ofrece métricas y accesos inmediatos.
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/20">
                                    <Zap className="w-4 h-4 text-cyan-300"/>
                                    <span className="font-semibold text-cyan-200">Rendimiento Máximo</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <HeartPulse className="w-16 h-16 text-white/50"/>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid - Soft UI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const {bg} = getGradientClasses(stat.color);
                    const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                    // Determinar color basado en trend
                    const trendColor = stat.trend === 'up' ? 'text-emerald-500' : (stat.trend === 'down' ? 'text-red-500' : 'text-gray-500');

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{opacity: 0, y: 40, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            transition={{duration: 0.7, delay: index * 0.15}}
                            className="group cursor-pointer"
                            // Soft Shadow para efecto neumórfico
                            whileHover={{y: -5, scale: 1.03, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05)'}}
                        >
                            {/* CAMBIO: Tarjetas blancas con blur (Light Glassmorphism) */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/50 transition-all duration-500 relative overflow-hidden">
                                {/* Gradiente sutil para el fondo */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-30`}></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${bg} shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300`}>
                                            <stat.icon className="w-6 h-6 text-white"/>
                                        </div>
                                        {/* Se muestra solo si el valor de cambio no es N/A */}
                                        {stat.change !== 'N/A' && (
                                            <div className={`flex items-center space-x-1 text-sm font-bold ${trendColor} bg-white/50 px-3 py-1 rounded-full border border-gray-100`}>
                                                <TrendIcon className="w-4 h-4"/>
                                                <span>{stat.change}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-gray-900 font-semibold mb-1 text-lg">{stat.label}</p>
                                    {/* Mostrar descripción o mensaje de error */}
                                    <p className={`text-sm ${stat.value === 'Error' || stat.description === 'Error al cargar datos' ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions & Recent Activity (Diseño Asimétrico) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Acciones Médicas Esenciales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {quickActions.map((action, index) => {
                            const {bg, hoverBg, text} = getGradientClasses(action.color);
                            return (
                                <motion.button
                                    key={action.title}
                                    onClick={action.action}
                                    whileHover={{scale: 1.05, y: -5}}
                                    whileTap={{scale: 0.98}}
                                    // CAMBIO: Tarjetas claras
                                    className={`p-6 bg-white/80 backdrop-blur-xl rounded-3xl text-left group transition-all duration-500 shadow-xl border border-gray-200/50 hover:border-transparent relative overflow-hidden`}
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{duration: 0.6, delay: index * 0.15}}
                                >
                                    {/* Gradiente de fondo en hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300`}>
                                            <action.icon className="w-7 h-7 text-white"/>
                                        </div>
                                        <h4 className={`font-extrabold text-xl mb-2 ${text} transition-colors text-gray-900`}>
                                            {action.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {action.description}
                                        </p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h3>
                    {/* CAMBIO: Tarjetas claras */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-6 shadow-xl space-y-2">
                        {/* CORRECCIÓN: Usar la actividad actualizada (o simulada) */}
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => {
                                const statusColor = activity.status === 'success' ? 'emerald' : activity.status === 'info' ? 'blue' : 'amber';
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, x: 10}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.5, delay: index * 0.1}}
                                        className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50/70 transition-all duration-300 cursor-pointer"
                                        whileHover={{x: 5, scale: 1.01}}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 bg-${statusColor}-500 shadow-md shadow-${statusColor}-500/50`}/>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 text-sm font-semibold leading-relaxed">
                                                {activity.action}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                        <motion.div
                                            className={`text-${statusColor}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                            whileHover={{scale: 1.2}}
                                        >
                                            <ActivityIcon className="w-4 h-4"/>
                                        </motion.div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No hay actividad reciente registrada.
                            </div>
                        )}
                        <motion.button
                            className="w-full mt-4 py-3 text-indigo-600 font-bold rounded-2xl bg-indigo-50/50 hover:bg-indigo-100 transition-all duration-300 border border-indigo-200/50"
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                        >
                            Ver historial completo
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (!user) {
        // Loader
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center p-10 rounded-xl bg-white/80 shadow-2xl backdrop-blur-md">
                    <motion.div
                        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{rotate: 360}}
                        transition={{ease: "linear", duration: 1, repeat: Infinity}}
                    ></motion.div>
                    <p className="text-gray-600 font-medium">Cargando plataforma médica...</p>
                </div>
            </div>
        );
    }

    return (
        // CAMBIO: Fondo principal claro suave (bg-slate-50)
        <div className="min-h-screen bg-slate-50 text-gray-900 flex font-sans">
            {/* Sidebar Navigation - Light Glassmorphism */}
            <motion.div
                initial={{x: -100, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.6, ease: "easeOut"}}
                // CAMBIO: Sidebar blanco roto para contraste
                className="w-72 bg-white/80 backdrop-blur-3xl shadow-xl shadow-blue-100 border-r border-gray-100 flex flex-col"
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-100">
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => setActiveSection('overview')}
                        whileHover={{scale: 1.02}}
                        transition={{type: "spring", stiffness: 400, damping: 15}}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Stethoscope className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-600">
                                DataVox<span className="font-semibold">Medical</span>
                            </span>
                            <p className="text-xs text-gray-500 font-medium tracking-wider">PLATAFORMA INTELIGENTE</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Links (NavItem ya ajustado a colores claros) */}
                <nav className="flex-1 p-5 space-y-2">
                    {[
                        {id: 'overview', label: 'Resumen General', icon: Grid, color: 'blue'},
                        {id: 'recordings', label: 'Dictados Médicos', icon: Mic, color: 'red'},
                        {id: 'patients', label: 'Gestión de Pacientes', icon: Users, color: 'emerald'},
                        {id: 'reports', label: 'Reportes Clínicos', icon: FileText, color: 'amber'},
                        {id: 'schedule', label: 'Agenda Médica', icon: Calendar, color: 'purple'},
                    ].map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeSection === item.id}
                            onClick={() => setActiveSection(item.id)}
                            color={item.color}
                        />
                    ))}
                </nav>

                {/* Footer/User Section */}
                <div className="p-4 border-t border-gray-100 bg-white/70">
                    <motion.div
                        className="flex items-center space-x-3 p-3 bg-white/90 rounded-2xl border border-gray-200/50 shadow-inner hover:shadow-lg transition-all duration-300 cursor-pointer"
                        whileHover={{scale: 1.02}}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">
                                    {user.initials}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {user.full_name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                {user.role}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar - Minimalista y funcional */}
                <header className="bg-white/90 backdrop-blur-2xl shadow-lg shadow-gray-100 border-b border-gray-100 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-8 py-5">
                        <motion.div
                            initial={{opacity: 0, x: -10}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.4}}
                        >
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                {{
                                    overview: 'Panel de Control Inteligente',
                                    recordings: 'Sistema de Dictado Médico',
                                    patients: 'Gestión de Pacientes',
                                    reports: 'Reportes y Documentación',
                                    schedule: 'Agenda Médica'
                                }[activeSection]}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                {/* CORRECCIÓN: Saludo Único en el Top Bar */}
                                <span className="font-semibold text-indigo-600">{getGreeting()}, {user.full_name?.split(' ')[0] || 'Colega'}</span>
                                <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-500"/>
                                    <span>{currentTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
                                </span>
                                <span className="flex items-center space-x-1 text-emerald-600 font-medium bg-emerald-50/70 px-2 py-0.5 rounded-lg border border-emerald-100">
                                    <ShieldCheck className="w-3 h-3"/>
                                    {dailyMetricsStatus}
                                </span>
                            </div>
                        </motion.div>

                        <div className="flex items-center space-x-4">
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{scale: 1.1, backgroundColor: '#EFF6FF'}}
                                    whileTap={{scale: 0.95}}
                                    className="p-3 text-gray-600 hover:text-cyan-600 transition-colors duration-300 bg-white/70 rounded-full border border-gray-200/50 shadow-md relative"
                                >
                                    <Bell className="w-5 h-5"/>
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                </motion.button>

                                <motion.button
                                    whileHover={{scale: 1.1, backgroundColor: '#EFF6FF'}}
                                    whileTap={{scale: 0.95}}
                                    className="p-3 text-gray-600 hover:text-cyan-600 transition-colors duration-300 bg-white/70 rounded-full border border-gray-200/50 shadow-md"
                                >
                                    <Settings className="w-5 h-5"/>
                                </motion.button>

                                {/* Botón de Logout (Diseño claro) */}
                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-red-300/50"
                                >
                                    <LogOut className="w-4 h-4"/>
                                    <span className="text-sm">Salir</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Renderiza el contenido dinámico según activeSection */}
                    {renderContent()}
                </main>
            </div>

            {/* Componente Global de Notificación */}
            <NotificationToast notifications={notifications} removeNotification={removeNotification} />
        </div>
    );
};

export default Dashboard;