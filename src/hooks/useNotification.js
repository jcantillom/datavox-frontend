// src/hooks/useNotification.js
import {useState, useCallback} from 'react';

const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(note => note.id !== id));
    }, []);

    const showNotification = useCallback((type, message, duration = 5000) => {
        const id = Date.now() + Math.random();
        const newNote = {
            id,
            type: type || 'info',
            message: message || 'Acción completada.',
        };

        setNotifications(prev => [...prev, newNote]);

        // Auto-eliminar después de la duración
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    // Métodos de acceso rápido (wrapper)
    const success = useCallback((message, duration) => showNotification('success', message, duration), [showNotification]);
    const error = useCallback((message, duration) => showNotification('error', message, duration), [showNotification]);
    const info = useCallback((message, duration) => showNotification('info', message, duration), [showNotification]);
    const warning = useCallback((message, duration) => showNotification('warning', message, duration), [showNotification]);
    const system = useCallback((message, duration) => showNotification('system', message, duration), [showNotification]);
    const ai = useCallback((message, duration) => showNotification('ai', message, duration), [showNotification]);

    return {
        notifications,
        removeNotification,
        showNotification,
        // Métodos de uso en componentes
        success,
        error,
        info,
        warning,
        system,
        ai
    };
};

export default useNotification;