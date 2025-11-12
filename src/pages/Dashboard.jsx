// src/pages/Dashboard.jsx
import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Stethoscope, FileText, Users, Activity, LogOut, Mic, Calendar, Download, Shield} from 'lucide-react';
import {authService} from '../services/auth';
import AudioRecorder from '../components/AudioRecorder';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([
        {icon: FileText, label: 'Documentos Generados', value: 'Loading...', change: '+0%'},
        {icon: Users, label: 'Pacientes Atendidos', value: 'Loading...', change: '+0%'},
        {icon: Activity, label: 'Tiempo Ahorrado', value: 'Loading...', change: '+0%'},
        {icon: Stethoscope, label: 'Dictados Procesados', value: 'Loading...', change: '+0%'},
    ]);

    const recentActivities = [
        {action: 'Historia clínica completada - Dr. Pérez', time: 'Hace 2 min', status: 'success'},
        {action: 'Informe radiológico generado - Dra. García', time: 'Hace 5 min', status: 'info'},
        {action: 'Backup del sistema realizado', time: 'Hace 1 hora', status: 'warning'},
        {action: 'Nuevo usuario agregado - Dr. Rodríguez', time: 'Hace 2 horas', status: 'success'},
    ];

    useEffect(() => {
        loadUserData();
        loadStats();
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

    const loadStats = async () => {
        setTimeout(() => {
            setStats([
                {icon: FileText, label: 'Documentos Generados', value: '1,234', change: '+12%'},
                {icon: Users, label: 'Pacientes Atendidos', value: '892', change: '+8%'},
                {icon: Activity, label: 'Tiempo Ahorrado', value: '45h', change: '+23%'},
                {icon: Stethoscope, label: 'Dictados Procesados', value: '567', change: '+15%'},
            ]);
        }, 1000);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3 cursor-pointer"
                             onClick={() => window.location.href = '/'}>
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

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-900 font-medium">{user.full_name || user.email}</p>
                                <p className="text-xs text-gray-500">{user.role || 'Médico'}</p>
                            </div>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4"/>
                                <span>Cerrar Sesión</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bienvenido, {user.full_name || user.email}!
                        </h1>
                        <motion.div
                            animate={{rotate: [0, 10, -10, 0]}}
                            transition={{duration: 2, repeat: Infinity}}
                        >
                            <Stethoscope className="w-6 h-6 text-blue-500"/>
                        </motion.div>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Resumen de actividad médica de hoy.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md"
                            whileHover={{y: -5, scale: 1.02}}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <stat.icon
                                        className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors"/>
                                </div>
                                <motion.span
                                    className="text-green-500 text-sm font-semibold"
                                    whileHover={{scale: 1.1}}
                                >
                                    {stat.change}
                                </motion.span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Audio Recorder Section */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.3}}
                    className="mb-8"
                >
                    <AudioRecorder />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
                            <div className="flex items-center space-x-2 text-green-500">
                                <Shield className="w-4 h-4"/>
                                <span className="text-sm font-medium">Sistema Activo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl text-white text-left group hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
                            >
                                <FileText className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform"/>
                                <h3 className="font-semibold text-lg mb-2">Informe Radiológico</h3>
                                <p className="text-teal-100 text-sm">Generar informe con membrete</p>
                            </motion.button>

                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                className="p-6 bg-white border-2 border-gray-300 rounded-xl text-gray-700 text-left group hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                            >
                                <Calendar
                                    className="w-8 h-8 mb-3 text-gray-600 group-hover:text-blue-600 transition-colors"/>
                                <h3 className="font-semibold text-lg mb-2">Agenda Médica</h3>
                                <p className="text-gray-600 text-sm">Ver pacientes programados</p>
                            </motion.button>

                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                className="p-6 bg-white border-2 border-gray-300 rounded-xl text-gray-700 text-left group hover:border-teal-300 hover:bg-teal-50 transition-all duration-300"
                            >
                                <Download
                                    className="w-8 h-8 mb-3 text-gray-600 group-hover:text-teal-600 transition-colors"/>
                                <h3 className="font-semibold text-lg mb-2">Exportar Reportes</h3>
                                <p className="text-gray-600 text-sm">Generar reportes mensuales</p>
                            </motion.button>

                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white text-left group hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                            >
                                <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform"/>
                                <h3 className="font-semibold text-lg mb-2">Gestión de Usuarios</h3>
                                <p className="text-purple-100 text-sm">Administrar personal médico</p>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Recent Activities */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6, delay: 0.6}}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm"
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <Activity className="w-5 h-5 text-blue-500"/>
                            <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.4, delay: index * 0.1}}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                                    whileHover={{x: 5}}
                                >
                                    <div className="relative">
                                        <div className={`w-2 h-2 rounded-full ${
                                            activity.status === 'success' ? 'bg-green-500' :
                                                activity.status === 'info' ? 'bg-blue-500' :
                                                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                        } group-hover:scale-125 transition-transform`}/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 text-sm group-hover:text-blue-600 transition-colors font-medium">
                                            {activity.action}
                                        </p>
                                        <p className="text-gray-500 text-xs group-hover:text-gray-600 transition-colors">
                                            {activity.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;