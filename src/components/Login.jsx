import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LogIn, User, KeyRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/shadcn/card'; 
import { Input } from './ui/shadcn/input';
import { Button } from './ui/shadcn/button';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    setLoading(true);
    const result = await login(credentials);
    if (result.success) {
      toast.success(`¡Bienvenido, ${result.user.first_name}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const loginAsTestUser = (user) => {
    setCredentials({ username: user.username, password: user.password });
    toast('Ingresando como Padre de Prueba...', { icon: '👨‍👩‍👧‍👦' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-t-4 border-primary">
          <CardHeader className="text-center">
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
              <img src="/vite.svg" alt="Logo" className="h-16 w-auto mx-auto" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-text">Bienvenido a ColegioApp</CardTitle>
            <CardDescription>Inicia sesión para ver el progreso académico.</CardDescription>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
                <Input
                  id="username"
                  name="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                  placeholder="Usuario"
                  className="pl-10"
                required
              />
            </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
                <Input
                  id="password"
                  name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                  placeholder="Contraseña"
                  className="pl-10"
                required
                />
              </div>
              <Button 
            type="submit"
            disabled={loading}
                className="w-full font-bold"
              >
                {loading ? 'Ingresando...' : <> <LogIn size={18} className="mr-2" /> Ingresar </>}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-text-light mb-3">O ingresa con un usuario de prueba:</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loginAsTestUser({ username: 'olalla.arellano', password: 'padre123' })}
            className="bg-card text-text px-4 py-2 rounded-lg shadow-sm border text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            👨‍👩‍👧‍👦 Ingresar como Padre
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 