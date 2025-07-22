import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('¡Hasta pronto!');
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: [0, 10, -5, 0] }} transition={{ duration: 0.3 }}>
                <img src="/vite.svg" alt="Logo" className="h-8 w-auto text-primary" />
              </motion.div>
              <span className="text-xl font-bold text-gray-800">ColegioApp</span>
            </Link>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm text-text">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-text-light">Padre de Familia</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full text-text-light hover:bg-primary-50 hover:text-primary transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 