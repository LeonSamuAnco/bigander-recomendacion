import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Decodificar el token para obtener el ID del usuario
      let tokenPayload;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Token inválido');
        }
        tokenPayload = JSON.parse(atob(tokenParts[1]));
      } catch (tokenError) {
        console.error('Error decodificando token:', tokenError);
        localStorage.removeItem('authToken');
        setLoading(false);
        return;
      }

      const userId = tokenPayload.sub || tokenPayload.id;

      // Verificar si el token no ha expirado
      const currentTime = Date.now() / 1000;
      if (tokenPayload.exp < currentTime) {
        localStorage.removeItem('authToken');
        setLoading(false);
        return;
      }

      // Obtener los datos del usuario
      const response = await fetch(`http://localhost:3002/auth/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        localStorage.removeItem('authToken');
        setLoading(false);
        return;
      }

      const userData = await response.json();
      
      // Verificar que el usuario y el rol existan
      if (!userData.user) {
        console.error('No se encontró información del usuario');
        localStorage.removeItem('authToken');
        setLoading(false);
        return;
      }

      if (!userData.user.role) {
        console.error('Usuario sin rol asignado');
        localStorage.removeItem('authToken');
        setLoading(false);
        return;
      }

      setUser(userData.user);

      // Verificar si el usuario tiene permisos para acceder
      const userRoleCode = userData.user.role.codigo;
      if (allowedRoles.length === 0 || allowedRoles.includes(userRoleCode)) {
        setAuthorized(true);
      }

    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-message">
          <h2>🚫 Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p>Tu rol actual: <strong>{user.rol.nombre}</strong></p>
          <p>Roles permitidos: <strong>{allowedRoles.join(', ')}</strong></p>
          <button onClick={() => window.location.href = '/dashboard'}>
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
