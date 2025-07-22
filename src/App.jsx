import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PadreDashboard from './components/dashboards/PadreDashboard';
import DetalleHijo from './components/dashboards/DetalleHijo';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Toaster position="bottom-right" toastOptions={{
          className: 'font-sans',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }} />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute allowedRoles={['padre']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            >
              <Route index element={<Navigate to="padre" replace />} />
              <Route path="padre" element={<PadreDashboard />} />
              <Route path="padre/hijo/:alumnoId" element={<DetalleHijo />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
