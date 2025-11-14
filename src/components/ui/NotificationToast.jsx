// src/components/ui/NotificationToast.jsx
import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircle, AlertTriangle, X, Info, ShieldOff, Brain} from 'lucide-react';

const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    info: Info,
    warning: AlertTriangle,
    system: ShieldOff,
    ai: Brain
};

const colors = {
    // Definimos todos los tipos de colores
    success: {bg: 'from-emerald-500 to-green-600', text: 'text-green-50', border: 'border-green-500', icon: 'text-white'},
    error: {bg: 'from-red-600 to-pink-600', text: 'text-red-50', border: 'border-red-600', icon: 'text-white'},
    info: {bg: 'from-blue-600 to-cyan-500', text: 'text-blue-50', border: 'border-blue-500', icon: 'text-white'},
    warning: {bg: 'from-amber-500 to-orange-500', text: 'text-amber-50', border: 'border-amber-500', icon: 'text-white'},
    system: {bg: 'from-gray-700 to-gray-900', text: 'text-gray-200', border: 'border-gray-600', icon: 'text-white'},
    ai: {bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-50', border: 'border-indigo-500', icon: 'text-white'},
    // Fallback explícito para evitar TypeError
    default: {bg: 'from-gray-400 to-gray-500', text: 'text-white', border: 'border-gray-400', icon: 'text-white'},
};

const NotificationToast = ({notifications, removeNotification}) => {
    return (
        // CORRECCIÓN DE POSICIÓN: Anclaje al lado IZQUIERDO (left-4) para evitar conflicto con la barra lateral.
        <div className="fixed top-4 left-4 z-[100] space-y-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((note, index) => {
                    // CORRECCIÓN CLAVE: Aseguramos que type siempre sea una clave válida ('info' o 'default')
                    const type = note.type || 'info';
                    const color = colors[type] || colors.default;
                    const Icon = icons[type] || icons.info;

                    return (
                        <motion.div
                            key={note.id}
                            // Animación de entrada: Viene desde la izquierda
                            initial={{opacity: 0, x: -400}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -400, transition: {duration: 0.3}}}
                            layout
                            className={`pointer-events-auto max-w-sm w-full bg-gradient-to-r ${color.bg} rounded-xl shadow-2xl border-t-4 ${color.border} p-4 transform transition-all duration-300`}
                        >
                            <div className="flex items-start">
                                <div className={`flex-shrink-0 pt-1 ${color.icon}`}>
                                    <Icon className="w-6 h-6"/>
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    <p className={`text-sm font-bold ${color.text}`}>
                                        DataVox Medical - {type.toUpperCase()}
                                    </p>
                                    <p className="mt-1 text-sm text-white opacity-90">
                                        {note.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        onClick={() => removeNotification(note.id)}
                                        className="inline-flex text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                    >
                                        <X className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;