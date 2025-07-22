import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes logear el error a un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'white',
            color: '#333',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '600px',
            width: '100%'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😵</div>
            
            <h1 style={{ 
              color: '#e74c3c', 
              marginBottom: '20px',
              fontSize: '24px'
            }}>
              ¡Oops! Algo salió mal
            </h1>
            
            <p style={{ 
              color: '#666', 
              marginBottom: '30px',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              Ha ocurrido un error inesperado en la aplicación. 
              Esto puede ser temporal y usualmente se soluciona recargando la página.
            </p>

            {/* Información técnica (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '30px',
                textAlign: 'left',
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  Información técnica (desarrollo)
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  color: '#d32f2f',
                  margin: 0
                }}>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo.componentStack && (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    color: '#666',
                    fontSize: '10px',
                    marginTop: '10px'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 30px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#2980b9'}
                onMouseOut={(e) => e.target.style.background = '#3498db'}
              >
                🔄 Recargar Página
              </button>
              
              <button
                onClick={this.handleGoBack}
                style={{
                  padding: '12px 30px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#7f8c8d'}
                onMouseOut={(e) => e.target.style.background = '#95a5a6'}
              >
                ↩️ Intentar de Nuevo
              </button>
            </div>

            <div style={{
              marginTop: '30px',
              fontSize: '12px',
              color: '#666'
            }}>
              Si el problema persiste, contacta al administrador del sistema.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 