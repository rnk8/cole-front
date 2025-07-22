import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/shadcn/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/shadcn/table';
import { Alert, AlertDescription, AlertTitle } from '../ui/shadcn/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  BookOpen, 
  Star, 
  ChevronDown, 
  ArrowLeft, 
  Award, 
  MessageSquareText, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Lightbulb,
  ChevronRight,
  Eye,
  Calendar as CalendarIcon
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

const TendenciaIcono = ({ tendencia, size = 16 }) => {
  const iconProps = { size, className: "ml-1" };
  
  switch (tendencia) {
    case 'mejorando':
    case 'ascendente':
      return <ArrowUp {...iconProps} className="text-green-500" />;
    case 'empeorando':
    case 'descendente':
      return <ArrowDown {...iconProps} className="text-red-500" />;
    default:
      return <Minus {...iconProps} className="text-gray-400" />;
  }
};

const NavegacionHermanos = ({ navegacion, hijoActualId }) => {
  const navigate = useNavigate();
  
  if (navegacion?.es_hijo_unico) return null;

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="shadow-md bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Otros hijos:</span>
            </div>
            <div className="flex gap-2">
              {navegacion?.hermanos?.map((hermano) => (
                <button
                  key={hermano.id}
                  onClick={() => navigate(`/dashboard/padre/hijo/${hermano.id}`)}
                  className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {hermano.user__first_name} {hermano.user__last_name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ResumenEstadisticas = ({ estadisticas }) => {
  const stats = [
    {
      titulo: 'Promedio General',
      valor: estadisticas?.promedio_general || 'N/A',
      icono: <TrendingUp className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      descripcion: `${estadisticas?.materias_con_notas || 0}/${estadisticas?.total_materias || 0} materias`
    },
    {
      titulo: 'Asistencia',
      valor: estadisticas?.porcentaje_asistencia ? `${estadisticas.porcentaje_asistencia}%` : 'N/A',
      icono: <CheckCircle className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      descripcion: `${estadisticas?.dias_presente || 0}/${estadisticas?.total_dias || 0} días`
    },
    {
      titulo: 'Participaciones',
      valor: estadisticas?.total_participaciones || 0,
      icono: <Award className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      descripcion: 'Últimos 90 días'
    }
  ];

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Resumen del Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${stat.color} text-center`}
              >
                <div className="flex justify-center mb-2">{stat.icono}</div>
                <p className="text-3xl font-bold">{stat.valor}</p>
                <p className="text-sm font-medium opacity-80">{stat.titulo}</p>
                <p className="text-xs opacity-60 mt-1">{stat.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AnalisisRendimiento = ({ analisis }) => {
  if (!analisis) return null;

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'excelente':
        return 'text-green-600 bg-green-100';
      case 'bueno':
        return 'text-blue-600 bg-blue-100';
      case 'regular':
        return 'text-yellow-600 bg-yellow-100';
      case 'necesita_mejora':
      case 'preocupante':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNivelTexto = (nivel) => {
    switch (nivel) {
      case 'excelente':
        return 'Excelente';
      case 'bueno':
        return 'Bueno';
      case 'regular':
        return 'Regular';
      case 'necesita_mejora':
        return 'Necesita Mejora';
      case 'preocupante':
        return 'Preocupante';
      default:
        return 'Sin Datos';
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-purple-600" />
            Análisis de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nivel Académico */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Nivel Académico</h4>
              <div className={`px-3 py-2 rounded-lg ${getNivelColor(analisis.nivel_academico)}`}>
                <span className="font-medium">{getNivelTexto(analisis.nivel_academico)}</span>
              </div>
            </div>

            {/* Nivel de Asistencia */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Asistencia</h4>
              <div className={`px-3 py-2 rounded-lg ${getNivelColor(analisis.nivel_asistencia)}`}>
                <span className="font-medium">{getNivelTexto(analisis.nivel_asistencia)}</span>
              </div>
            </div>

            {/* Materias Destacadas */}
            {analisis.materias_destacadas?.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Materias Destacadas
                </h4>
                <div className="space-y-2">
                  {analisis.materias_destacadas.map((materia, index) => (
                    <div key={index} className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{materia.materia}</span>
                      <span className="text-sm font-bold text-green-600">{materia.promedio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Materias que Necesitan Atención */}
            {analisis.materias_atencion?.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Necesitan Atención
                </h4>
                <div className="space-y-2">
                  {analisis.materias_atencion.map((materia, index) => (
                    <div key={index} className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{materia.materia}</span>
                      <span className="text-sm font-bold text-red-600">{materia.promedio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Recomendaciones = ({ recomendaciones }) => {
  if (!recomendaciones || recomendaciones.length === 0) return null;

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'media':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'baja':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recomendaciones.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${getPrioridadColor(rec.prioridad)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold mb-1">{rec.titulo}</h4>
                    <p className="text-sm opacity-80">{rec.descripcion}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-white bg-opacity-50 rounded">
                      Prioridad {rec.prioridad}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ComparacionPeriodos = ({ comparacion }) => {
  if (!comparacion) return null;

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Comparación con Período Anterior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Período Anterior</h4>
              <p className="text-2xl font-bold text-blue-600">
                {comparacion.promedio_anterior || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {comparacion.evaluaciones_anterior || 0} evaluaciones
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Período Actual</h4>
              <p className="text-2xl font-bold text-green-600">
                {comparacion.promedio_actual || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {comparacion.evaluaciones_actual || 0} evaluaciones
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Diferencia</h4>
              <div className="flex items-center justify-center">
                <p className={`text-2xl font-bold ${
                  comparacion.diferencia > 0 ? 'text-green-600' : 
                  comparacion.diferencia < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {comparacion.diferencia > 0 ? '+' : ''}{comparacion.diferencia || '0'}
                </p>
                <TendenciaIcono tendencia={comparacion.tendencia} size={20} />
              </div>
              <p className="text-xs text-gray-500 capitalize">
                {comparacion.tendencia}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AsistenciaCard = ({ asistencias }) => (
  <motion.div variants={itemVariants}>
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <span>Asistencia Reciente</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {asistencias && asistencias.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {asistencias.slice(0, 15).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(item.fecha).toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    {item.hora_llegada && (
                      <p className="text-xs text-gray-500">
                        Llegada: {item.hora_llegada}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.registrado_por_qr && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        QR
                      </span>
                    )}
                    {item.presente ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay registros de asistencia recientes.</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const MateriaCard = ({ materia, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('notas');

  const promedioNotas = materia.notas && materia.notas.length > 0 
    ? (materia.notas.reduce((acc, n) => acc + n.valor, 0) / materia.notas.length).toFixed(1) 
    : 'N/A';
  
  const promedioColor = promedioNotas === 'N/A' 
    ? 'text-gray-400' 
    : (parseFloat(promedioNotas) >= 70 ? 'text-green-600' : 'text-red-500');
  
  const totalParticipaciones = materia.participaciones?.length || 0;

  const TabButton = ({ tabName, label, count }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors relative ${
        activeTab === tabName 
        ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
        : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
          activeTab === tabName ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <CardHeader 
        onClick={() => onToggle(materia.id, materia.id)} 
        className="cursor-pointer flex flex-row justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b"
      >
        <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
          <BookOpen className="w-6 h-6 text-blue-600" />
          {materia.nombre}
        </CardTitle>
        <div className="flex items-center gap-4">
          {totalParticipaciones > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
              <Award size={14} />
              <span>{totalParticipaciones}</span>
            </div>
          )}
          <span className={`font-bold text-xl ${promedioColor}`}>{promedioNotas}</span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="text-gray-500" />
          </motion.div>
        </div>
      </CardHeader>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Pestañas */}
              <div className="flex border-b bg-gray-50">
                <TabButton 
                  tabName="notas" 
                  label="Calificaciones" 
                  count={materia.notas?.length || 0}
                />
                <TabButton 
                  tabName="participaciones" 
                  label="Participación" 
                  count={totalParticipaciones}
                />
              </div>
              
              <div className="p-5">
                {activeTab === 'notas' && (
                  <div>
                    {materia.notas && materia.notas.length > 0 ? (
                      <div className="space-y-3">
                        {materia.notas.map((nota, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">
                                {nota.observaciones || `Evaluación ${i + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(nota.fecha_registro).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <span className={`text-xl font-bold ${
                              nota.valor >= 70 ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {nota.valor}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Sin calificaciones en este período.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'participaciones' && (
                  <div>
                    {materia.participaciones && materia.participaciones.length > 0 ? (
                      <div className="space-y-4">
                        {materia.participaciones.map((p, i) => (
                          <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Award size={16} className="text-blue-600"/>
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800 capitalize">
                                  {p.tipo_participacion || 'Participación'}
                                </p>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-blue-600">+{p.valor}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(p.fecha).toLocaleDateString('es-ES', {
                                      day: '2-digit', 
                                      month: 'short'
                                    })}
                                  </p>
                                </div>
                              </div>
                              {p.observaciones && (
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                  <MessageSquareText size={14} /> 
                                  {p.observaciones}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Sin participaciones registradas.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetalleHijo = () => {
  const { alumnoId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hijo, setHijo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMaterias, setOpenMaterias] = useState(new Set());

  const periodoSeleccionado = searchParams.get('periodo');

  const handleMateriaToggle = (materiaId, index) => {
    const newOpenMaterias = new Set(openMaterias);
    const materias = hijo?.materias;
    if (!materias) return;

    let adjacentMateriaId = null;

    // Determinar la materia adyacente en una cuadrícula de 2 columnas
    if (index % 2 === 0) { // Índice par
      if (index + 1 < materias.length) {
        adjacentMateriaId = materias[index + 1].id;
      }
    } else { // Índice impar
      adjacentMateriaId = materias[index - 1].id;
    }

    const isCurrentlyOpen = newOpenMaterias.has(materiaId);

    if (isCurrentlyOpen) {
      newOpenMaterias.delete(materiaId);
      if (adjacentMateriaId) newOpenMaterias.delete(adjacentMateriaId);
    } else {
      newOpenMaterias.add(materiaId);
      if (adjacentMateriaId) newOpenMaterias.add(adjacentMateriaId);
    }

    setOpenMaterias(newOpenMaterias);
  };

  useEffect(() => {
    const fetchDetalleHijo = async () => {
      setLoading(true);
      try {
        const url = periodoSeleccionado 
          ? `/padre/hijo/${alumnoId}/?periodo=${periodoSeleccionado}` 
          : `/padre/hijo/${alumnoId}/`;
        const response = await api.get(url);
        setHijo(response.data);
        
        if (!periodoSeleccionado && response.data.periodos_disponibles?.length > 0) {
          setSearchParams({ periodo: response.data.periodos_disponibles[0] });
        }
      } catch (err) {
        setError('No se pudo cargar la información del alumno.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetalleHijo();
  }, [alumnoId, periodoSeleccionado, setSearchParams]);

  const handlePeriodoChange = (nuevoPeriodo) => {
    setSearchParams({ periodo: nuevoPeriodo });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Panel
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            {hijo?.nombre_completo || 'Cargando...'}
          </h1>
          <p className="text-lg text-gray-600">
            {hijo?.curso_nombre} • {hijo?.nivel}
          </p>
        </div>
        
        {hijo?.periodos_disponibles?.length > 0 && (
          <Select onValueChange={handlePeriodoChange} value={periodoSeleccionado || ''}>
            <SelectTrigger className="w-full md:w-[220px] bg-white shadow-sm">
              <SelectValue placeholder="Seleccionar Periodo" />
            </SelectTrigger>
            <SelectContent>
              {hijo.periodos_disponibles.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.replace('T', ' - Trimestre ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </motion.div>

      <motion.div
        key={periodoSeleccionado}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading || !hijo ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Navegación entre hermanos */}
            <NavegacionHermanos navegacion={hijo.navegacion} hijoActualId={alumnoId} />

            {/* Resumen de estadísticas */}
            <ResumenEstadisticas estadisticas={hijo.estadisticas_periodo} />

            {/* Comparación con período anterior */}
            <ComparacionPeriodos comparacion={hijo.comparacion_periodos} />

            {/* Análisis de rendimiento */}
            <AnalisisRendimiento analisis={hijo.analisis_rendimiento} />

            {/* Recomendaciones */}
            <Recomendaciones recomendaciones={hijo.recomendaciones} />

            {/* Contenido principal: Asistencia y Materias */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Asistencia */}
              <div className="lg:col-span-1">
                <AsistenciaCard asistencias={hijo.asistencias} />
              </div>

              {/* Materias */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {hijo.materias?.length > 0 ? (
                    hijo.materias.map((materia, index) => (
                      <MateriaCard 
                        key={materia.id} 
                        materia={materia} 
                        isOpen={openMaterias.has(materia.id)}
                        onToggle={() => handleMateriaToggle(materia.id, index)}
                      />
                    ))
                  ) : (
                    <div className="xl:col-span-2">
                      <Card className="shadow-md">
                        <CardContent className="p-8 text-center">
                          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            No hay materias registradas
                          </h3>
                          <p className="text-gray-500">
                            Las materias aparecerán aquí cuando sean asignadas al curso.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje informativo si no hay datos */}
            {!hijo.periodos_disponibles?.length && (
              <Alert className="mt-8 bg-blue-50 border-blue-200">
                <Star className="h-5 w-5 text-blue-500"/>
                <AlertTitle className="text-blue-800">Información Académica</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Las calificaciones y evaluaciones aparecerán aquí cuando sean registradas por los maestros.
                  El seguimiento académico se actualiza regularmente.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DetalleHijo; 