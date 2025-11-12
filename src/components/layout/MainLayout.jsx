import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({children}) => {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Header/>
            <main className="min-h-screen">
                {children}
            </main>
            <Footer/>
        </div>
    );
};

export default MainLayout;