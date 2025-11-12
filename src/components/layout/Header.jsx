// src/components/layout/Header.jsx
import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Menu, X, Stethoscope, Trophy, LogIn, Radiation} from 'lucide-react';
import {useLocation} from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        {name: 'Solución Clínicas', href: '#clinicas', icon: Stethoscope},
        {name: 'Solución Radiología', href: '#radiologia', icon: Radiation},
        {name: 'Casos de Éxito', href: '#casos', icon: Trophy},
    ];

    const handleNavigationClick = (href) => {
        if (location.pathname !== '/') {
            // Si no estamos en la página principal, redirigir a la página principal con la ancla
            window.location.href = `/${href}`;
        } else {
            // Si estamos en la página principal, hacer scroll suave
            const element = document.getElementById(href.substring(1));
            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg'
                    : 'bg-transparent'
            }`}
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{duration: 0.6}}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Médico Profesional - Clickable */}
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{scale: 1.05}}
                        transition={{type: "spring", stiffness: 400, damping: 10}}
                        onClick={() => window.location.href = '/'}
                    >
                        <div className="relative">
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                <div className="flex items-end space-x-1">
                                    {[2, 4, 3, 2].map((height, index) => (
                                        <motion.div
                                            key={index}
                                            className="w-1 bg-white rounded-full"
                                            style={{height: `${height}px`}}
                                            animate={{
                                                height: [
                                                    `${height}px`,
                                                    `${height + 2}px`,
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
                        </div>
                        <span
                            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            DataVox<span className="text-blue-600">Medical</span>
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigationClick(item.href);
                                }}
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group font-medium relative"
                                whileHover={{y: -2}}
                                transition={{type: "spring", stiffness: 400, damping: 10}}
                            >
                                <item.icon className="w-4 h-4 group-hover:text-blue-500 transition-colors"/>
                                <span>{item.name}</span>
                                <div
                                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-300"/>
                            </motion.a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={() => window.location.href = '/contact'}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg font-semibold text-white hover:from-blue-500 hover:to-teal-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 30px -10px rgba(37, 99, 235, 0.4)"
                        }}
                        whileTap={{scale: 0.95}}
                    >
                        <LogIn className="w-4 h-4"/>
                        <span>Solicitar Demo</span>
                    </motion.button>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {navigation.map((item) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigationClick(item.href);
                                        }}
                                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                                        whileHover={{x: 10}}
                                    >
                                        <item.icon className="w-5 h-5"/>
                                        <span>{item.name}</span>
                                    </motion.a>
                                ))}
                                <motion.button
                                    onClick={() => window.location.href = '/contact'}
                                    className="w-full flex items-center justify-center space-x-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg font-semibold text-white"
                                    whileTap={{scale: 0.95}}
                                >
                                    <LogIn className="w-4 h-4"/>
                                    <span>Solicitar Demo</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
};

export default Header;