// src/pages/Dashboard.jsx - VERSIÓN MEJORADA
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
    Shield,
    BarChart3,
    Settings,
    Bell,
    Search,
    Plus,
    Clock,
    CheckCircle
} from 'lucide-react';
import {authService} from '../services/auth';
import AudioRecorder from '../components/AudioRecorder';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'recordings', 'patients', 'reports'
    const [stats, setStats] = useState([
        {icon: FileText, label: 'Documentos Generados', value: '1,234', change: '+12%', trend: 'up'},
        {icon: Users, label: 'Pacientes Atendidos', value: '892', change: '+8%', trend: 'up'},
        {icon: Activity, label: 'Tiempo Ahorrado', value: '45h', change: '+23%', trend: 'up'},
        {icon: Stethoscope, label: 'Dictados Procesados', value: '567', change: '+15%', trend: 'up'},
    ]);

    const recentActivities = [
        {action: 'Historia clínica completada - Dr. Pérez', time: 'Hace 2 min', status: 'success', type: 'document'},
        {action: 'Informe radiológico generado - Dra. García', time: 'Hace 5 min', status: 'info', type: 'report'},
        {action: 'Backup del sistema realizado', time: 'Hace 1 hora', status: 'warning', type: 'system'},
        {action: 'Nuevo usuario agregado - Dr. Rodríguez', time: 'Hace 2 horas', status: 'success', type: 'user'},
    ];

    const quickActions = [
        {
            title: 'Nuevo Dictado',
            description: 'Iniciar grabación médica',
            icon: Mic,
            color: 'red',
            action: () => setActiveSection('recordings')
        },
        {
            title: 'Informe Radiológico',
            description: 'Generar con membrete',
            icon: FileText,
            color: 'teal',
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
            title: 'Exportar Reportes',
            description: 'Generar reportes mensuales',
            icon: Download,
            color: 'purple',
            action: () => setActiveSection('reports')
        },
    ];

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userInfo = await authService.getCurrentUser();
            setUser(userInfo);
        } catch (error) {
            console.error('Error loading user data:', error);
            authService.logout();
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando plataforma médica...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
            {/* Sidebar Navigation */}
            <motion.div
                initial={{x: -100, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => setActiveSection('overview')}
                    >
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                            <div className="flex items-end space-x-0.5">
                                {[2, 3, 4, 3, 2].map((height, index) => (
                                    <motion.div
                                        key={index}
                                        className="w-1 bg-white rounded-full"
                                        style={{height: `${height}px`}}
                                        animate={{
                                            height: [
                                                `${height}px`,
                                                `${height + 1}px`,
                                                `${height}px`,
                                            ],
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
                        <span
                            className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            DataVox<span className="font-semibold">Medical</span>
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        {id: 'overview', label: 'Resumen', icon: BarChart3},
                        {id: 'recordings', label: 'Dictados', icon: Mic},
                        {id: 'patients', label: 'Pacientes', icon: Users},
                        {id: 'reports', label: 'Reportes', icon: FileText},
                        {id: 'schedule', label: 'Agenda', icon: Calendar},
                    ].map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                activeSection === item.id
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            whileHover={{x: 5}}
                        >
                            <item.icon className="w-5 h-5"/>
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div
                            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.full_name || user.email}
                            </p>
                            <p className="text-xs text-gray-500">{user.role || 'Médico'}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {{
                                    overview: 'Resumen General',
                                    recordings: 'Dictados Médicos',
                                    patients: 'Gestión de Pacientes',
                                    reports: 'Reportes y Documentos',
                                    schedule: 'Agenda Médica'
                                }[activeSection]}
                            </h1>
                            <p className="text-gray-600">
                                {{
                                    overview: 'Resumen de actividad médica y estadísticas',
                                    recordings: 'Grabar y gestionar dictados médicos',
                                    patients: 'Administrar información de pacientes',
                                    reports: 'Generar y exportar reportes médicos',
                                    schedule: 'Calendario de citas y programaciones'
                                }[activeSection]}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search
                                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Notifications */}
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                            >
                                <Bell className="w-6 h-6"/>
                                <div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            </motion.button>

                            {/* Settings */}
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Settings className="w-6 h-6"/>
                            </motion.button>

                            {/* Logout */}
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4"/>
                                <span>Salir</span>
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-auto">
                    {activeSection === 'overview' && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className="space-y-6"
                        >
                            {/* Welcome Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            Bienvenido, Dr. {user.full_name || user.email}!
                                        </h2>
                                        <p className="text-blue-100 opacity-90">
                                            Resumen de su actividad médica de hoy. Todo está al día.
                                        </p>
                                    </div>
                                    <motion.div
                                        animate={{rotate: [0, 10, -10, 0]}}
                                        transition={{duration: 2, repeat: Infinity}}
                                    >
                                        <Stethoscope className="w-12 h-12 text-white opacity-80"/>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.6, delay: index * 0.1}}
                                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
                                        whileHover={{y: -5, scale: 1.02}}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div
                                                className={`p-3 rounded-xl bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                                                <stat.icon
                                                    className={`w-6 h-6 text-${stat.color}-500 group-hover:text-${stat.color}-600 transition-colors`}/>
                                            </div>
                                            <div className={`flex items-center space-x-1 text-sm font-semibold ${
                                                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                <span>{stat.change}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quick Actions & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Quick Actions */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {quickActions.map((action, index) => (
                                            <motion.button
                                                key={action.title}
                                                onClick={action.action}
                                                whileHover={{scale: 1.02}}
                                                whileTap={{scale: 0.98}}
                                                className={`p-6 bg-white border-2 border-gray-200 rounded-xl text-left group hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-300`}
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                transition={{duration: 0.6, delay: index * 0.1}}
                                            >
                                                <div
                                                    className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-${action.color}-200 transition-colors`}>
                                                    <action.icon className={`w-6 h-6 text-${action.color}-600`}/>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                                                <p className="text-gray-600 text-sm">{action.description}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <div className="space-y-4">
                                            {recentActivities.map((activity, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{opacity: 0, y: 10}}
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.4, delay: index * 0.1}}
                                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                                                    whileHover={{x: 5}}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        activity.status === 'success' ? 'bg-green-500' :
                                                            activity.status === 'info' ? 'bg-blue-500' :
                                                                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                    } group-hover:scale-125 transition-transform`}/>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-gray-900 text-sm group-hover:text-blue-600 transition-colors font-medium truncate">
                                                            {activity.action}
                                                        </p>
                                                        <p className="text-gray-500 text-xs group-hover:text-gray-600 transition-colors">
                                                            {activity.time}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <motion.button
                                            className="w-full mt-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                                            whileHover={{scale: 1.02}}
                                        >
                                            Ver toda la actividad
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
                        >
                            <AudioRecorder/>
                        </motion.div>
                    )}

                    {/* Add other sections similarly */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;