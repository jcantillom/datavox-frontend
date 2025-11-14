import React from 'react';
import {motion} from 'framer-motion';
import {Stethoscope, FileText, Shield, Mail, Phone, MapPin} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        'Soluciones': [
            {name: 'Para Clínicas', href: '#clinicas'},
            {name: 'Para Radiología', href: '#radiologia'},
            {name: 'Para Hospitales', href: '#hospitales'},
            {name: 'Precios', href: '#precios'},
        ],
        'Recursos': [
            {name: 'Documentación', href: '#docs'},
            {name: 'Centro de Ayuda', href: '#help'},
            {name: 'Blog Médico', href: '#blog'},
            {name: 'Casos de Éxito', href: '#casos'},
        ],
        'Legal': [
            {name: 'Política de Privacidad', href: '#privacy'},
            {name: 'Términos de Servicio', href: '#terms'},
            {name: 'HIPAA Compliance', href: '#hipaa'},
            {name: 'Seguridad', href: '#security'},
        ],
    };

    const contactInfo = [
        {icon: Mail, text: 'info@datavoxmedical.com'},
        {icon: Phone, text: '+57 (301) 4613592'},
        {icon: MapPin, text: 'Bogota, Colombia'},
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                    >
                        <div className="flex items-center space-x-3 mb-4 cursor-pointer"
                             onClick={() => window.location.href = '/'}>
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
                                <div className="flex items-end space-x-1">
                                    {[2, 3, 4, 3].map((height, index) => (
                                        <div key={index} className="w-1 bg-white rounded-full"
                                             style={{height: `${height}px`}}/>
                                    ))}
                                </div>
                            </div>
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                DataVoxMedical
              </span>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md text-sm leading-relaxed">
                            Plataforma líder en transformación de dictados médicos en documentación clínica
                            automatizada.
                            Mejore la eficiencia de su institución médica con nuestra tecnología de vanguardia.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 text-gray-300 text-sm">
                                    <item.icon className="w-4 h-4 text-blue-400"/>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([category, links], index) => (
                        <motion.div
                            key={category}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.6, delay: index * 0.1}}
                        >
                            <h3 className="text-white font-semibold mb-4 text-lg">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <motion.a
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                                            whileHover={{x: 5}}
                                        >
                                            {link.name}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center"
                    initial={{opacity: 0}}
                    whileInView={{opacity: 1}}
                    transition={{duration: 0.6, delay: 0.4}}
                >
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} DataVoxMedical. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 text-green-400">
                            <Shield className="w-4 h-4"/>
                            <span className="text-xs">Certificado HIPAA</span>
                        </div>
                        <motion.a
                            href="#privacy"
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                            whileHover={{scale: 1.05}}
                        >
                            Privacidad
                        </motion.a>
                        <motion.a
                            href="#terms"
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                            whileHover={{scale: 1.05}}
                        >
                            Términos
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;