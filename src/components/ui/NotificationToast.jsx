// src/components/ui/NotificationToast.jsx
import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircle, AlertTriangle, X, Info, ShieldOff, Brain, AlertOctagon, BellRing} from 'lucide-react'; // BellRing para SYSTEM

const icons = {
    success: CheckCircle,
    error: AlertOctagon,
    info: Info,
    warning: AlertTriangle,
    system: BellRing, // Un icono más distintivo para SYSTEM
    ai: Brain
};

// Paleta de colores para un look más premium (fondo oscuro, acento de color)
const colors = {
    success: {accent: 'emerald', bg: 'bg-emerald-600/90', icon: 'text-white', text: 'text-white'},
    error: {accent: 'red', bg: 'bg-red-600/90', icon: 'text-white', text: 'text-white'},
    info: {accent: 'blue', bg: 'bg-blue-600/90', icon: 'text-white', text: 'text-white'},
    warning: {accent: 'amber', bg: 'bg-amber-600/90', icon: 'text-white', text: 'text-white'},
    system: {accent: 'slate', bg: 'bg-slate-700/90', icon: 'text-white', text: 'text-white'}, // Gris oscuro para system
    ai: {accent: 'indigo', bg: 'bg-indigo-600/90', icon: 'text-white', text: 'text-white'},
    default: {accent: 'gray', bg: 'bg-gray-600/90', icon: 'text-white', text: 'text-white'},
};

const NotificationToast = ({notifications, removeNotification}) => {
    return (
        // POSICIÓN: En la esquina superior derecha, más abajo para no superponer títulos.
        // Espaciado del top-28 para dejar espacio para el título y la barra de navegación.
        <div className="fixed top-28 right-6 z-[100] space-y-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((note, index) => {
                    const type = note.type || 'info';
                    const color = colors[type] || colors.default;
                    const Icon = icons[type] || icons.info;

                    return (
                        <motion.div
                            key={note.id}
                            // Animación de entrada/salida desde la derecha, más pronunciada y rápida
                            initial={{opacity: 0, x: 200, scale: 0.9}}
                            animate={{opacity: 1, x: 0, scale: 1}}
                            exit={{opacity: 0, x: 200, scale: 0.9, transition: {duration: 0.2}}}
                            layout
                            // ESTÉTICA PREMIUM: Fondo oscuro con blur, ring de acento, shadow más fuerte
                            className={`pointer-events-auto max-w-sm w-full ${color.bg} backdrop-blur-md rounded-lg shadow-xl shadow-black/20 ring-1 ring-white/10 p-4 transition-all duration-300`}
                        >
                            <div className="flex items-start"> {/* items-start para alinear el icono con la primera línea de texto */}
                                {/* Icono Grande y Centrado Verticalmente */}
                                <div className={`flex-shrink-0 pt-0.5 ${color.icon}`}>
                                    <Icon className="w-6 h-6"/>
                                </div>

                                <div className="ml-3 flex-1">
                                    <p className={`text-sm font-semibold ${color.text}`}>
                                        {/* Título más descriptivo */}
                                        DataVox Medical - {type.toUpperCase()}
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/90 font-medium">
                                        {note.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        onClick={() => removeNotification(note.id)}
                                        className="inline-flex text-white/50 hover:text-white transition-colors p-1 rounded-full"
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