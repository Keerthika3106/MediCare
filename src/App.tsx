import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';
import PharmacistDashboard from './components/dashboards/PharmacistDashboard';
import CaretakerDashboard from './components/dashboards/CaretakerDashboard';
import FamilyDashboard from './components/dashboards/FamilyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/doctor-dashboard"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-dashboard"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pharmacist-dashboard"
                element={
                  <ProtectedRoute requiredRole="pharmacist">
                    <PharmacistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caretaker-dashboard"
                element={
                  <ProtectedRoute requiredRole="caretaker">
                    <CaretakerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/family-dashboard"
                element={
                  <ProtectedRoute requiredRole="family">
                    <FamilyDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;