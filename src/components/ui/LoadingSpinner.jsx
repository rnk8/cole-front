import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Cargando...', 
  fullScreen = false,
  variant = 'primary'
}) => {
  
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4'
  };

  const variantClasses = {
    primary: 'border-green-600 border-t-transparent',
    secondary: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50'
    : 'flex flex-col items-center justify-center py-12 px-5';

  return (
    <div className={containerClasses}>
      {/* Spinner */}
      <div 
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full
          animate-spin
          mb-4
        `}
      />
      
      {/* Message */}
      <div className="text-gray-600 text-center font-medium">
        {message}
      </div>

      {/* Pulsing dots */}
      <div className="flex space-x-1 mt-3">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

// Componente especializado para pantalla completa
export const FullScreenLoader = ({ message = 'Cargando sistema...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
    <div className="card max-w-md w-full text-center">
      <div className="colegio-logo mx-auto mb-6">
        ⏳
      </div>
      <LoadingSpinner size="large" message={message} />
      <div className="mt-6 text-sm text-gray-500">
        Sistema Educativo Santa Cruz
      </div>
      <div className="flex justify-center items-center space-x-1 mt-2">
        <span className="w-3 h-1 bg-green-600 rounded-full"></span>
        <span className="w-3 h-1 bg-white border border-green-600 rounded-full"></span>
        <span className="w-3 h-1 bg-green-600 rounded-full"></span>
      </div>
    </div>
  </div>
);

// Componente de carga en línea
export const InlineLoader = ({ message = 'Cargando...' }) => (
  <div className="flex items-center justify-center space-x-3 py-4">
    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-gray-600 text-sm">{message}</span>
  </div>
);

// Componente de carga para botones
export const ButtonLoader = ({ size = 'small' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`${sizeClass} border-2 border-white border-t-transparent rounded-full animate-spin`} />
  );
};

export default LoadingSpinner; 