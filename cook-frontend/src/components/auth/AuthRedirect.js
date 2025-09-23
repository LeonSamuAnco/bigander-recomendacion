import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que redirige a usuarios autenticados lejos de páginas de auth
 * Si el usuario ya está logueado, lo redirige al dashboard
 * Si no está logueado, muestra el componente hijo (Login/Register)
 */
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading, getDashboardRoute } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>🍳 CookSync</h2>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute()} replace />;
  }

  // Si no está autenticado, mostrar el componente hijo (Login/Register)
  return children;
};

export default AuthRedirect;
