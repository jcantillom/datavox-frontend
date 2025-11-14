// src/components/ui/NotificationToast.jsx
import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircle, AlertTriangle, X, Info, ShieldOff, Brain, AlertOctagon} from 'lucide-react';

const icons = {
    success: CheckCircle,
    error: AlertOctagon,
    info: Info,
    warning: AlertTriangle,
    system: ShieldOff,
    ai: Brain
};

// Paleta de colores más profesional con gradientes sutiles
const colors = {
    success: {bg: 'from-emerald-100 to-green-100/80', icon: 'text-emerald-600', text: 'text-emerald-800', border: 'border-emerald-500'},
    error: {bg: 'from-red-100 to-pink-100/80', icon: 'text-red-600', text: 'text-red-800', border: 'border-red-500'},
    info: {bg: 'from-blue-100 to-cyan-100/80', icon: 'text-blue-600', text: 'text-blue-800', border: 'border-blue-500'},
    warning: {bg: 'from-amber-100 to-orange-100/80', icon: 'text-amber-600', text: 'text-amber-800', border: 'border-amber-500'},
    system: {bg: 'from-gray-100 to-gray-200/80', icon: 'text-gray-600', text: 'text-gray-800', border: 'border-gray-500'},
    ai: {bg: 'from-indigo-100 to-purple-100/80', icon: 'text-indigo-600', text: 'text-indigo-800', border: 'border-purple-500'},
    default: {bg: 'from-gray-50 to-gray-100/80', icon: 'text-gray-500', text: 'text-gray-700', border: 'border-gray-400'},
};

const NotificationToast = ({notifications, removeNotification}) => {
    return (
        // POSICIÓN OPTIMIZADA: Anclaje a la esquina INFERIOR DERECHA
        // Esto evita la superposición con títulos y elementos superiores.
        <div className="fixed bottom-6 right-6 z-[100] space-y-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((note, index) => {
                    const type = note.type || 'info';
                    const color = colors[type] || colors.default;
                    const Icon = icons[type] || icons.info;

                    return (
                        <motion.div
                            key={note.id}
                            // Animación de entrada/salida desde abajo
                            initial={{opacity: 0, y: 50, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, y: 50, scale: 0.95, transition: {duration: 0.2}}}
                            layout
                            // ESTÉTICA MODERNA Y PROFESIONAL: Gradientes sutiles, fondo más suave, sombras limpias
                            className={`pointer-events-auto max-w-sm w-full bg-gradient-to-r ${color.bg} backdrop-blur-md rounded-xl shadow-lg shadow-black/10 border-l-4 ${color.border} p-4 transition-all duration-300`}
                        >
                            <div className="flex items-start"> {/* Alineación superior para mensajes largos */}
                                {/* Icono de Acento */}
                                <div className={`flex-shrink-0 pt-0.5 ${color.icon}`}>
                                    <Icon className="w-6 h-6"/>
                                </div>

                                <div className="ml-3 flex-1">
                                    <p className={`text-base font-semibold ${color.text} flex items-center`}> {/* Texto más grande */}
                                        {/* Título unificado y profesional */}
                                        DataVox Medical - {type.toUpperCase()}
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-700 font-medium">
                                        {note.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        onClick={() => removeNotification(note.id)}
                                        className="inline-flex text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"
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