import axios from 'axios';
import config from '../config/config';

// Configuración base de axios
const API_URL = config.API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar responses y errores
api.interceptors.response.use(
  (response) => {
    // Procesar respuesta paginada del backend Django
    if (response.data && typeof response.data === 'object') {
      // Si la respuesta tiene paginación (results, count, next, previous)
      if (response.data.hasOwnProperty('results')) {
        return {
          ...response,
          data: {
            ...response.data,
            items: response.data.results, // Para compatibilidad
            total: response.data.count,
            page: 1, // Calcular página actual si es necesario
            pageSize: response.data.results?.length || 0
          }
        };
      }
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Mejorar mensajes de error
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'object') {
        // Manejar errores de validación de Django
        const errorMessage = Object.values(errorData).flat().join(', ');
        error.message = errorMessage || error.message;
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
};

// Servicios específicos para maestros - Optimizados para el flujo del backend
export const maestroAPI = {
  // Obtener todos los maestros con paginación
  getMaestros: (params = {}) => api.get('/maestros/', { params }),
  
  // Obtener maestro específico
  getMaestro: (id) => api.get(`/maestros/${id}/`),
  
  // Crear nuevo maestro
  createMaestro: (data) => api.post('/maestros/', data),
  
  // Actualizar maestro
  updateMaestro: (id, data) => api.put(`/maestros/${id}/`, data),
  
  // Eliminar maestro
  deleteMaestro: (id) => api.delete(`/maestros/${id}/`),
};

// Servicios de cursos optimizados
export const cursoAPI = {
  // Obtener cursos del maestro autenticado
  getCursos: (params = {}) => api.get('/cursos/', { params }),
  
  // Obtener curso específico
  getCurso: (id) => api.get(`/cursos/${id}/`),
  
  // Crear curso
  createCurso: (data) => api.post('/cursos/', data),
  
  // Actualizar curso
  updateCurso: (id, data) => api.put(`/cursos/${id}/`, data),
  
  // Eliminar curso
  deleteCurso: (id) => api.delete(`/cursos/${id}/`),
};

// Servicios de materias optimizados
export const materiaAPI = {
  // Obtener materias con filtros
  getMaterias: (cursoId = null, params = {}) => {
    const queryParams = cursoId ? { ...params, curso: cursoId } : params;
    return api.get('/materias/', { params: queryParams });
  },
  
  // Obtener materia específica
  getMateria: (id) => api.get(`/materias/${id}/`),
  
  // Crear materia
  createMateria: (data) => api.post('/materias/', data),
  
  // Actualizar materia
  updateMateria: (id, data) => api.put(`/materias/${id}/`, data),
  
  // Eliminar materia
  deleteMateria: (id) => api.delete(`/materias/${id}/`),
};

// Servicios de alumnos optimizados para maestros
export const alumnoAPI = {
  // Obtener alumnos (filtrados por permisos del maestro)
  getAlumnos: (params = {}) => api.get('/alumnos/', { params }),
  
  // Obtener alumno específico
  getAlumno: (id) => api.get(`/alumnos/${id}/`),
  
  // Obtener alumnos por curso
  getAlumnosByCurso: (cursoId) => {
    return api.get('/alumnos/', { params: { curso: cursoId } });
  },
  
  // Crear alumno
  createAlumno: (data) => api.post('/alumnos/', data),
  
  // Actualizar alumno
  updateAlumno: (id, data) => api.put(`/alumnos/${id}/`, data),
  
  // Eliminar alumno
  deleteAlumno: (id) => api.delete(`/alumnos/${id}/`),
};

// Servicios de notas optimizados para maestros
export const notaAPI = {
  // Obtener notas con filtros específicos
  getNotas: (params = {}) => api.get('/notas/', { params }),
  
  // Obtener nota específica
  getNota: (id) => api.get(`/notas/${id}/`),
  
  // Crear nueva nota
  createNota: (data) => api.post('/notas/', data),
  
  // Actualizar nota existente
  updateNota: (id, data) => api.put(`/notas/${id}/`, data),
  
  // Eliminar nota
  deleteNota: (id) => api.delete(`/notas/${id}/`),
  
  // Obtener notas por alumno y periodo
  getNotasByAlumnoAndPeriodo: (alumnoId, periodo) => {
    return api.get('/notas/', { 
      params: { 
        alumno: alumnoId, 
        periodo: periodo 
      } 
    });
  },
  
  // Obtener notas por materia y periodo
  getNotasByMateriaAndPeriodo: (materiaId, periodo) => {
    return api.get('/notas/', { 
      params: { 
        materia: materiaId, 
        periodo: periodo 
      } 
    });
  },
  
  // Obtener todas las notas de un periodo específico
  getNotasByPeriodo: (periodo) => {
    return api.get('/notas/', { params: { periodo } });
  },
  
  // Crear o actualizar múltiples notas (batch)
  createOrUpdateNotas: async (notas) => {
    const promises = notas.map(nota => {
      if (nota.id) {
        return api.put(`/notas/${nota.id}/`, nota);
      } else {
        return api.post('/notas/', nota);
      }
    });
    return Promise.all(promises);
  },
};

// Servicios de participaciones optimizados
export const participacionAPI = {
  // Obtener participaciones con filtros
  getParticipaciones: (params = {}) => api.get('/participaciones/', { params }),
  
  // Obtener participación específica
  getParticipacion: (id) => api.get(`/participaciones/${id}/`),
  
  // Crear nueva participación
  createParticipacion: (data) => api.post('/participaciones/', data),
  
  // Actualizar participación existente
  updateParticipacion: (id, data) => api.put(`/participaciones/${id}/`, data),
  
  // Eliminar participación
  deleteParticipacion: (id) => api.delete(`/participaciones/${id}/`),
  
  // Obtener participaciones por fecha
  getParticipacionesByFecha: (fecha) => {
    return api.get('/participaciones/', { params: { fecha } });
  },
  
  // Obtener participaciones por alumno y fecha
  getParticipacionesByAlumnoAndFecha: (alumnoId, fecha) => {
    return api.get('/participaciones/', { 
      params: { 
        alumno: alumnoId, 
        fecha: fecha 
      } 
    });
  },
  
  // Obtener participaciones por materia y fecha
  getParticipacionesByMateriaAndFecha: (materiaId, fecha) => {
    return api.get('/participaciones/', { 
      params: { 
        materia: materiaId, 
        fecha: fecha 
      } 
    });
  },
};

// Servicios de asistencia
export const asistenciaAPI = {
  // Obtener asistencias con filtros
  getAsistencias: (params = {}) => api.get('/asistencia/', { params }),
  
  // Obtener asistencia específica
  getAsistencia: (id) => api.get(`/asistencia/${id}/`),
  
  // Crear nueva asistencia
  createAsistencia: (data) => api.post('/asistencia/', data),
  
  // Actualizar asistencia
  updateAsistencia: (id, data) => api.put(`/asistencia/${id}/`, data),
  
  // Eliminar asistencia
  deleteAsistencia: (id) => api.delete(`/asistencia/${id}/`),
  
  // Registro de asistencia por QR
  registrarAsistenciaQR: (data) => api.post('/asistencia/qr/', data),
  
  // Obtener asistencias por fecha
  getAsistenciasByFecha: (fecha) => {
    return api.get('/asistencia/', { params: { fecha } });
  },
  
  // Obtener asistencias por alumno
  getAsistenciasByAlumno: (alumnoId) => {
    return api.get('/asistencia/', { params: { alumno: alumnoId } });
  },
};

// Servicios de predicción IA
export const prediccionAPI = {
  getPrediccion: (alumnoId, periodo) => api.get(`/prediccion/${alumnoId}/${periodo}/`),
};

// Servicios de utilidades
export const utilsAPI = {
  // Obtener información de la API
  getApiInfo: () => api.get('/'),
  
  // Validar token
  validateToken: async () => {
    try {
      const response = await api.get('/');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Obtener periodos académicos disponibles
  getPeriodosAcademicos: () => {
    const currentYear = new Date().getFullYear();
    return [
      `${currentYear}-T1`,
      `${currentYear}-T2`,
      `${currentYear}-T3`,
      `${currentYear}-T4`
    ];
  },

  // Formatear fecha para el backend (YYYY-MM-DD)
  formatDateForBackend: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  // Formatear fecha para mostrar
  formatDateForDisplay: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear fecha y hora
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Calcular edad
  calcularEdad: (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  },

  // Procesar respuesta del backend con paginación
  processBackendResponse: (response) => {
    if (response.data && response.data.results) {
      return {
        data: response.data.results,
        total: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        hasNext: !!response.data.next,
        hasPrevious: !!response.data.previous
      };
    }
    return {
      data: response.data || [],
      total: Array.isArray(response.data) ? response.data.length : 0,
      hasNext: false,
      hasPrevious: false
    };
  }
};

// Servicios combinados específicos para el dashboard del maestro
export const maestroDashboardAPI = {
  // Obtener todos los datos necesarios para el dashboard del maestro
  getDashboardData: async (maestroId) => {
    try {
      const [cursosRes, alumnosRes] = await Promise.all([
        cursoAPI.getCursos(),
        alumnoAPI.getAlumnos()
      ]);

      const cursos = utilsAPI.processBackendResponse(cursosRes);
      const alumnos = utilsAPI.processBackendResponse(alumnosRes);

      // Encontrar el curso del maestro tutor
      const miCurso = cursos.data.find(c => c.tutor === maestroId);
      
      if (miCurso) {
        // Obtener materias del curso
        const materiasRes = await materiaAPI.getMaterias(miCurso.id);
        const materias = utilsAPI.processBackendResponse(materiasRes);

        // Filtrar alumnos del curso
        const misAlumnos = alumnos.data.filter(a => a.curso_nombre === miCurso.nombre);

        return {
          curso: miCurso,
          alumnos: misAlumnos,
          materias: materias.data,
          estadisticas: {
            totalAlumnos: misAlumnos.length,
            totalMaterias: materias.data.length,
            cursoNombre: miCurso.nombre
          }
        };
      }

      return {
        curso: null,
        alumnos: [],
        materias: [],
        estadisticas: {
          totalAlumnos: 0,
          totalMaterias: 0,
          cursoNombre: null
        }
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      throw error;
    }
  },

  // Obtener datos para la gestión de notas
  getNotasData: async (maestroId, periodo) => {
    try {
      const dashboardData = await maestroDashboardAPI.getDashboardData(maestroId);
      
      if (!dashboardData.curso) {
        throw new Error('No se encontró curso asignado al maestro');
      }

      // Obtener notas del periodo
      const notasRes = await notaAPI.getNotasByPeriodo(periodo);
      const todasNotas = utilsAPI.processBackendResponse(notasRes);
      
      // Filtrar notas de los alumnos del maestro
      const misAlumnosIds = dashboardData.alumnos.map(a => a.id);
      const misNotas = todasNotas.data.filter(n => misAlumnosIds.includes(n.alumno));

      return {
        ...dashboardData,
        notas: misNotas,
        periodo: periodo
      };
    } catch (error) {
      console.error('Error fetching notas data:', error);
      throw error;
    }
  },

  // Obtener datos para la gestión de participaciones
  getParticipacionesData: async (maestroId, fecha) => {
    try {
      const dashboardData = await maestroDashboardAPI.getDashboardData(maestroId);
      
      if (!dashboardData.curso) {
        throw new Error('No se encontró curso asignado al maestro');
      }

      // Obtener participaciones de la fecha
      const participacionesRes = await participacionAPI.getParticipacionesByFecha(fecha);
      const todasParticipaciones = utilsAPI.processBackendResponse(participacionesRes);
      
      // Filtrar participaciones de los alumnos del maestro
      const misAlumnosIds = dashboardData.alumnos.map(a => a.id);
      const misParticipaciones = todasParticipaciones.data.filter(p => misAlumnosIds.includes(p.alumno));

      return {
        ...dashboardData,
        participaciones: misParticipaciones,
        fecha: fecha
      };
    } catch (error) {
      console.error('Error fetching participaciones data:', error);
      throw error;
    }
  }
};

// Servicios combinados para dashboards generales (alumnos, padres)
export const dashboardAPI = {
  // Obtener resumen completo de un alumno
  getResumenAlumno: async (alumnoId) => {
    try {
      const [notasRes, asistenciasRes, participacionesRes] = await Promise.all([
        notaAPI.getNotas({ alumno: alumnoId }),
        asistenciaAPI.getAsistencias({ alumno: alumnoId }),
        participacionAPI.getParticipaciones({ alumno: alumnoId })
      ]);

      const notas = utilsAPI.processBackendResponse(notasRes);
      const asistencias = utilsAPI.processBackendResponse(asistenciasRes);
      const participaciones = utilsAPI.processBackendResponse(participacionesRes);

      // Calcular promedio general
      const promedioGeneral = notas.data.length > 0 
        ? (notas.data.reduce((sum, nota) => sum + nota.valor, 0) / notas.data.length).toFixed(1)
        : 0;

      // Calcular porcentaje de asistencia
      const porcentajeAsistencia = asistencias.data.length > 0
        ? ((asistencias.data.filter(a => a.presente).length / asistencias.data.length) * 100).toFixed(1)
        : 100;

      // Calcular promedio de participaciones
      const promedioParticipaciones = participaciones.data.length > 0
        ? (participaciones.data.reduce((sum, p) => sum + p.valor, 0) / participaciones.data.length).toFixed(1)
        : 0;

      return {
        notas: notas.data,
        asistencias: asistencias.data,
        participaciones: participaciones.data,
        estadisticas: {
          promedioGeneral,
          porcentajeAsistencia,
          promedioParticipaciones,
          totalNotas: notas.data.length,
          totalAsistencias: asistencias.data.length,
          totalParticipaciones: participaciones.data.length
        }
      };
    } catch (error) {
      console.error('Error fetching student summary:', error);
      throw error;
    }
  },

  // Obtener estadísticas generales para administradores
  getEstadisticasGenerales: async () => {
    try {
      const [alumnosRes, maestrosRes, cursosRes] = await Promise.all([
        alumnoAPI.getAlumnos(),
        maestroAPI.getMaestros(),
        cursoAPI.getCursos()
      ]);
      
      const alumnos = utilsAPI.processBackendResponse(alumnosRes);
      const maestros = utilsAPI.processBackendResponse(maestrosRes);
      const cursos = utilsAPI.processBackendResponse(cursosRes);

      return {
        alumnos: alumnos.total || alumnos.data.length,
        maestros: maestros.total || maestros.data.length,
        cursos: cursos.total || cursos.data.length,
        padres: 0 // Se podría agregar una API de padres si es necesario
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Obtener resumen para padres (múltiples hijos)
  getResumenPadre: async (padreId) => {
    try {
      // Esta funcionalidad se puede implementar cuando sea necesaria
      // Por ahora retornamos un objeto vacío
      return {
        hijos: [],
        estadisticas: {
          totalHijos: 0,
          promedioGeneral: 0
        }
      };
    } catch (error) {
      console.error('Error fetching parent summary:', error);
      throw error;
    }
  }
};

// Backwards compatibility - mantener las exportaciones anteriores
export const managementAPI = {
  getAlumnos: alumnoAPI.getAlumnos,
  getAlumno: alumnoAPI.getAlumno,
  getMaestros: maestroAPI.getMaestros,
  getCursos: cursoAPI.getCursos,
  getMaterias: materiaAPI.getMaterias,
  getPadres: () => api.get('/padres/'),
};

export const academicAPI = {
  getNotas: notaAPI.getNotas,
  createNota: notaAPI.createNota,
  updateNota: notaAPI.updateNota,
  
  getAsistencias: asistenciaAPI.getAsistencias,
  createAsistencia: asistenciaAPI.createAsistencia,
  registrarAsistenciaQR: asistenciaAPI.registrarAsistenciaQR,
  
  getParticipaciones: participacionAPI.getParticipaciones,
  createParticipacion: participacionAPI.createParticipacion,
  
  getPrediccion: prediccionAPI.getPrediccion,
};

export default api; 