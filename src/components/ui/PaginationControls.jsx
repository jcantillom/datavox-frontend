// src/components/ui/PaginationControls.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    // Lógica para mostrar solo 5 botones de página alrededor de la página actual
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-between mt-8 p-4 bg-white/70 rounded-2xl shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
                Página <span className="font-bold text-gray-800">{currentPage}</span> de <span className="font-bold text-gray-800">{totalPages}</span>
            </p>
            <div className="flex items-center space-x-2">
                {/* Botón Anterior */}
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>

                {/* Números de Página */}
                {pageNumbers.map((page) => (
                    <motion.button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            page === currentPage
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        {page}
                    </motion.button>
                ))}

                {/* Botón Siguiente */}
                <motion.button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};

export default PaginationControls;