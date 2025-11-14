// src/App.jsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HeroSection from './components/sections/HeroSection';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports'; // NUEVO
import Patients from './pages/Patients'; // NUEVO
import Schedule from './pages/Schedule'; // NUEVO
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';
import FeaturesSection from './components/sections/FeaturesSection';
import UseCasesSection from './components/sections/UseCasesSection';
import SolutionsSection from './components/sections/SolutionsSection';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/login" element={<Login/>}/>

                {/* Rutas Protegidas dentro del Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
                {/* Estas rutas se manejarán dentro del componente Dashboard, por lo que no necesitan rutas separadas en este MVP */}
                {/* <Route path="/dashboard/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} /> */}
                {/* <Route path="/dashboard/patients" element={<ProtectedRoute><Patients/></ProtectedRoute>} /> */}
                {/* <Route path="/dashboard/schedule" element={<ProtectedRoute><Schedule/></ProtectedRoute>} /> */}

                <Route path="/" element={
                    <MainLayout>
                        <HeroSection/>
                        <FeaturesSection/>
                        <SolutionsSection/>
                        <UseCasesSection/>
                    </MainLayout>
                }/>
            </Routes>
        </Router>
    );
}

export default App;