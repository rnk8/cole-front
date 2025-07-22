import React from 'react';
import config from '../../config/config';

const AdminButton = ({ 
  adminPath, 
  entityName, 
  children, 
  style = {}, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ...props 
}) => {
  
  const handleClick = () => {
    if (disabled) return;
    
    const success = config.openAdminUrl(adminPath, `No se pudo abrir ${entityName}`);
    
    if (!success) {
      console.warn(`Error al abrir: ${config.getAdminUrl(adminPath)}`);
    }
  };

  // Estilos base
  const baseStyles = {
    border: 'none',
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  // Variantes de color
  const variants = {
    primary: {
      background: '#3498db',
      color: 'white',
      boxShadow: '0 2px 10px rgba(52, 152, 219, 0.3)'
    },
    success: {
      background: '#27ae60',
      color: 'white',
      boxShadow: '0 2px 10px rgba(39, 174, 96, 0.3)'
    },
    warning: {
      background: '#f39c12',
      color: 'white',
      boxShadow: '0 2px 10px rgba(243, 156, 18, 0.3)'
    },
    danger: {
      background: '#e74c3c',
      color: 'white',
      boxShadow: '0 2px 10px rgba(231, 76, 60, 0.3)'
    },
    info: {
      background: '#9b59b6',
      color: 'white',
      boxShadow: '0 2px 10px rgba(155, 89, 182, 0.3)'
    },
    dark: {
      background: '#34495e',
      color: 'white',
      boxShadow: '0 2px 10px rgba(52, 73, 94, 0.3)'
    },
    orange: {
      background: '#e67e22',
      color: 'white',
      boxShadow: '0 2px 10px rgba(230, 126, 34, 0.3)'
    }
  };

  // Tamaños
  const sizes = {
    small: {
      padding: '8px 15px',
      fontSize: '12px'
    },
    medium: {
      padding: '12px 20px',
      fontSize: '14px'
    },
    large: {
      padding: '15px 25px',
      fontSize: '16px'
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = variants[variant].boxShadow.replace('0.3', '0.5');
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = variants[variant].boxShadow;
    }
  };

  return (
    <button
      style={buttonStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      title={`Abrir ${entityName} en el panel de administración`}
      {...props}
    >
      {children}
    </button>
  );
};

export default AdminButton; 