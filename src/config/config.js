// Configuración de URLs para el frontend
export const config = {
  // URL base del backend API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // URLs específicas
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  ADMIN_URL: import.meta.env.VITE_ADMIN_URL || 'http://localhost:8000/admin',
  
  // Configuración de la aplicación
  APP_NAME: 'Sistema de Información del Colegio',
  APP_VERSION: '1.0.0',
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // URLs del panel de administración
  adminUrls: {
    base: '/admin/',
    alumnos: '/admin/core/alumno/',
    maestros: '/admin/core/maestro/',
    cursos: '/admin/core/curso/',
    materias: '/admin/core/materia/',
    notas: '/admin/core/nota/',
    asistencias: '/admin/core/asistencia/',
    participaciones: '/admin/core/participacion/',
    padres: '/admin/core/padre/',
    colegios: '/admin/core/colegio/',
  },
  
  // Utilidades
  getAdminUrl: (path = '') => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${path}`;
  },
  
  // Abrir URL en nueva pestaña con validación
  openAdminUrl: (path, fallbackMessage = 'No se pudo abrir el panel de administración') => {
    try {
      const fullUrl = config.getAdminUrl(path);
      const newWindow = window.open(fullUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // El popup fue bloqueado
        alert('Por favor, permite ventanas emergentes para acceder al panel de administración.\n\nURL: ' + fullUrl);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al abrir URL:', error);
      alert(fallbackMessage + '\n\nError: ' + error.message);
      return false;
    }
  }
};

export default config; 