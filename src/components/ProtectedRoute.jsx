// src/components/ProtectedRoute.jsx
import {useEffect, useState} from 'react';
import {authService} from '../services/auth';

const ProtectedRoute = ({children}) => {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                window.location.href = '/login';
                return;
            }

            try {
                await authService.getCurrentUser();
                setIsChecking(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
            }
        };

        checkAuth();
    }, []);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;