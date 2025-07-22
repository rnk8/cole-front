import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/shadcn/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/shadcn/avatar';
import { Alert, AlertDescription, AlertTitle } from '../ui/shadcn/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  GraduationCap, 
  Calendar,
  TrendingDown,
  Star,
  BookOpen,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  Bell,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/shadcn/select';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 400 }
  }
};

const ResumenGeneral = ({ resumen }) => {
  if (!resumen || !resumen.total_hijos) return null;

  const estadisticas = [
    {
      titulo: 'Total de Hijos',
      valor: resumen.total_hijos,
      icono: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      titulo: 'Promedio Familiar',
      valor: resumen.promedio_familiar ? `${resumen.promedio_familiar}` : 'N/A',
      icono: <GraduationCap className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      titulo: 'Asistencia Promedio',
      valor: resumen.asistencia_promedio ? `${resumen.asistencia_promedio}%` : 'N/A',
      icono: <Calendar className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      titulo: 'Alto Rendimiento',
      valor: resumen.hijos_rendimiento_alto || 0,
      icono: <Star className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Resumen Familiar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {estadisticas.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${stat.color} text-center`}
              >
                <div className="flex justify-center mb-2">{stat.icono}</div>
                <p className="text-2xl font-bold text-gray-800">{stat.valor}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.titulo}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AlertasImportantes = ({ alertas }) => {
  if (!alertas || alertas.length === 0) return null;

  const getAlertIcon = (nivel) => {
    switch (nivel) {
      case 'danger':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (nivel) => {
    switch (nivel) {
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertTitle className="text-red-800 font-semibold">Alertas Importantes</AlertTitle>
        <AlertDescription className="mt-2">
          <div className="space-y-2">
            {alertas.map((alerta, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alerta.nivel)} flex items-center gap-3`}>
                {getAlertIcon(alerta.nivel)}
                <div className="flex-grow">
                  <p className="font-medium">{alerta.hijo_nombre}</p>
                  <p className="text-sm">{alerta.mensaje}</p>
                </div>
                <Eye className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

const TendenciaIcono = ({ tendencia }) => {
  const iconProps = { size: 16, className: "ml-1" };
  
  switch (tendencia) {
    case 'mejorando':
      return <ArrowUp {...iconProps} className="text-green-500 ml-1" />;
    case 'empeorando':
      return <ArrowDown {...iconProps} className="text-red-500 ml-1" />;
    default:
      return <Minus {...iconProps} className="text-gray-400 ml-1" />;
  }
};

const EstadoAcademicoBadge = ({ estado }) => {
  const config = {
    excelente: { bg: 'bg-green-100', text: 'text-green-800', label: 'Excelente' },
    bueno: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Bueno' },
    regular: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Regular' },
    necesita_atencion: { bg: 'bg-red-100', text: 'text-red-800', label: 'Necesita Atención' },
    sin_datos: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Sin Datos' }
  };

  const { bg, text, label } = config[estado] || config.sin_datos;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
};

const HijoCard = ({ hijo }) => {
  const navigate = useNavigate();
  const getInitials = (name) => (name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '');

  const promedio = hijo.promedio_periodo ? hijo.promedio_periodo.toFixed(1) : 'N/A';
  const asistencia = hijo.porcentaje_asistencia !== null ? `${hijo.porcentaje_asistencia.toFixed(0)}%` : 'N/A';
  const promedioColor = promedio === 'N/A' ? 'text-gray-400' : (hijo.promedio_periodo >= 70 ? 'text-green-600' : 'text-red-500');

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/dashboard/padre/hijo/${hijo.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <CardHeader className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white shadow-md">
            <AvatarImage src={hijo.foto_url} alt={hijo.nombre_completo} />
            <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
              {getInitials(hijo.nombre_completo)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-lg font-bold text-gray-800 mb-1">
              {hijo.nombre_completo}
            </CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{hijo.curso_nombre}</p>
              <EstadoAcademicoBadge estado={hijo.estado_academico} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className={promedioColor} size={20} />
                <TendenciaIcono tendencia={hijo.tendencia_academica} />
              </div>
              <p className={`text-2xl font-bold ${promedioColor}`}>{promedio}</p>
              <p className="text-xs text-gray-600 font-medium">Promedio</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="text-blue-500 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-blue-600">{asistencia}</p>
              <p className="text-xs text-gray-600 font-medium">Asistencia</p>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              {hijo.total_participaciones_mes || 0} participaciones
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-red-500" />
              {hijo.dias_ausente_mes || 0} ausencias
            </span>
          </div>

          {/* Alertas del hijo */}
          {hijo.alertas && hijo.alertas.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle size={14} className="text-orange-500" />
                <span className="text-orange-700 font-medium">
                  {hijo.alertas.length} alerta{hijo.alertas.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Próximos eventos */}
          {hijo.proximos_eventos && hijo.proximos_eventos.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-1">Próximos eventos:</p>
              {hijo.proximos_eventos.slice(0, 1).map((evento, index) => (
                <p key={index} className="text-sm text-blue-600 font-medium">
                  {evento.titulo}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between text-blue-600 font-medium">
            <span className="text-sm">Ver detalles</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
};

const PadreDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/padre/dashboard/');
        setDashboardData(response.data);
      } catch (err) {
        setError('No se pudo cargar la información del dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const hijosFiltrados = React.useMemo(() => {
    if (!dashboardData?.hijos) return [];
    
    if (filtroEstado === 'todos') return dashboardData.hijos;
    
    return dashboardData.hijos.filter(hijo => {
      switch (filtroEstado) {
        case 'excelente':
          return hijo.estado_academico === 'excelente';
        case 'necesita_atencion':
          return hijo.estado_academico === 'necesita_atencion' || (hijo.alertas && hijo.alertas.length > 0);
        case 'baja_asistencia':
          return hijo.porcentaje_asistencia < 85;
        default:
          return true;
      }
    });
  }, [dashboardData, filtroEstado]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Padre</h1>
        <p className="text-lg text-gray-600">
          Monitorea el progreso académico de tus hijos • Período: {dashboardData?.periodo_actual || 'Actual'}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Alertas importantes */}
        <AlertasImportantes alertas={dashboardData?.alertas_importantes} />

        {/* Resumen general */}
        <ResumenGeneral resumen={dashboardData?.resumen_general} />

        {/* Filtros */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtrar hijos:</span>
                </div>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los hijos</SelectItem>
                    <SelectItem value="excelente">Rendimiento excelente</SelectItem>
                    <SelectItem value="necesita_atencion">Necesitan atención</SelectItem>
                    <SelectItem value="baja_asistencia">Baja asistencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjetas de hijos */}
        {error && (
          <motion.div variants={itemVariants}>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {hijosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {hijosFiltrados.map((hijo) => (
                <HijoCard key={hijo.id} hijo={hijo} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          !error && (
            <motion.div variants={itemVariants}>
              <Card className="shadow-md">
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {filtroEstado === 'todos' 
                      ? 'No hay hijos registrados' 
                      : 'No hay hijos que coincidan con el filtro'
                    }
                  </h3>
                  <p className="text-gray-500">
                    {filtroEstado === 'todos' 
                      ? 'Contacta con la administración para registrar a tus hijos.' 
                      : 'Intenta con un filtro diferente.'
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
};

export default PadreDashboard; 