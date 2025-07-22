import React, { useState, useEffect } from 'react';

// Context para manejar toasts globalmente
const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove después del duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    addToast,
    removeToast,
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration)
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={() => onRemove(toast.id)} 
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    // Esperar la animación antes de remover
    setTimeout(onRemove, 300);
  };

  const getTypeConfig = (type) => {
    const configs = {
      success: {
        bgClass: 'bg-green-600',
        borderClass: 'border-green-700',
        icon: '✅',
        progressClass: 'bg-green-800'
      },
      error: {
        bgClass: 'bg-red-600',
        borderClass: 'border-red-700',
        icon: '❌',
        progressClass: 'bg-red-800'
      },
      warning: {
        bgClass: 'bg-yellow-500',
        borderClass: 'border-yellow-600',
        icon: '⚠️',
        progressClass: 'bg-yellow-700'
      },
      info: {
        bgClass: 'bg-blue-600',
        borderClass: 'border-blue-700',
        icon: 'ℹ️',
        progressClass: 'bg-blue-800'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getTypeConfig(toast.type);

  const baseClasses = `
    ${config.bgClass}
    ${config.borderClass}
    text-white
    p-4
    rounded-xl
    shadow-xl
    border-l-4
    flex
    items-center
    gap-3
    min-w-80
    max-w-sm
    cursor-pointer
    relative
    overflow-hidden
    transition-all
    duration-300
    ease-out
    transform
  `;

  const animationClasses = isExiting 
    ? 'translate-x-full opacity-0 scale-95'
    : isVisible 
      ? 'translate-x-0 opacity-100 scale-100'
      : 'translate-x-full opacity-0 scale-95';

  return (
    <div 
      className={`${baseClasses} ${animationClasses}`}
      onClick={handleRemove}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0">
        {config.icon}
      </span>
      
      {/* Message */}
      <span className="flex-1 text-sm font-medium leading-relaxed">
        {toast.message}
      </span>
      
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        className="text-white hover:text-gray-200 transition-colors duration-200 text-xl font-bold flex-shrink-0 ml-2"
      >
        ×
      </button>
      
      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div 
          className={`absolute bottom-0 left-0 h-1 ${config.progressClass} animate-progress`}
          style={{
            animation: `progress ${toast.duration}ms linear forwards`
          }}
        />
      )}
    </div>
  );
};

// Componente de notificación específica para el sistema educativo
export const EducationalToast = ({ type, title, message, onClose }) => {
  const getTypeConfig = (type) => {
    const configs = {
      grade_added: {
        bgClass: 'bg-gradient-to-r from-green-600 to-green-700',
        icon: '📝',
        title: 'Nueva Calificación'
      },
      attendance_marked: {
        bgClass: 'bg-gradient-to-r from-blue-600 to-blue-700',
        icon: '📅',
        title: 'Asistencia Registrada'
      },
      participation_recorded: {
        bgClass: 'bg-gradient-to-r from-purple-600 to-purple-700',
        icon: '⭐',
        title: 'Participación Registrada'
      },
      assignment_due: {
        bgClass: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        icon: '⏰',
        title: 'Tarea Pendiente'
      },
      system_update: {
        bgClass: 'bg-gradient-to-r from-gray-600 to-gray-700',
        icon: '🔄',
        title: 'Actualización del Sistema'
      }
    };
    return configs[type] || configs.system_update;
  };

  const config = getTypeConfig(type);

  return (
    <div className={`${config.bgClass} text-white p-4 rounded-xl shadow-2xl border border-white border-opacity-20`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1">{title || config.title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors duration-200 text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Hook personalizado para notificaciones del sistema educativo
export const useEducationalToast = () => {
  const { addToast } = useToast();

  return {
    gradeAdded: (message) => addToast(message, 'success'),
    attendanceMarked: (message) => addToast(message, 'info'),
    participationRecorded: (message) => addToast(message, 'success'),
    assignmentDue: (message) => addToast(message, 'warning'),
    systemUpdate: (message) => addToast(message, 'info'),
    error: (message) => addToast(message, 'error'),
    success: (message) => addToast(message, 'success')
  };
};

// Agregar la animación de progreso usando CSS-in-JS
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(style);

export default Toast; 