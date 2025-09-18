import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientProfile from '../profiles/ClientProfile';
import VendorProfile from '../profiles/VendorProfile';
import AdminProfile from '../profiles/AdminProfile';
import ModeratorProfile from '../profiles/ModeratorProfile';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Decodificar el token para obtener el ID del usuario
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub || tokenPayload.id;

      // Verificar si el token no ha expirado
      const currentTime = Date.now() / 1000;
      if (tokenPayload.exp < currentTime) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      // Obtener los datos completos del usuario
      const response = await fetch(`http://localhost:3002/auth/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar el perfil del usuario');
      }

      const userData = await response.json();
      setUser(userData.user);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError(error.message);
      // Si hay error, redirigir al login después de un momento
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const renderProfileByRole = () => {
    if (!user || !user.role) {
      return (
        <div className="error-message">
          <h2>Error de Configuración</h2>
          <p>No se pudo determinar el tipo de usuario</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      );
    }

    const roleCode = user.role.codigo;

    switch (roleCode) {
      case 'CLIENTE':
        return <ClientProfile user={user} />;
      case 'VENDEDOR':
        return <VendorProfile user={user} />;
      case 'ADMIN':
        return <AdminProfile user={user} />;
      case 'MODERADOR':
        return <ModeratorProfile user={user} />;
      default:
        return (
          <div className="error-message">
            <h2>Tipo de Usuario No Reconocido</h2>
            <p>Rol: <strong>{roleCode}</strong></p>
            <p>Contacta al administrador para resolver este problema.</p>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>Cargando tu Dashboard...</h2>
          <p>Preparando tu experiencia personalizada</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h2>⚠️ Error al Cargar Dashboard</h2>
          <p>{error}</p>
          <p>Serás redirigido al login en unos segundos...</p>
          <button onClick={() => navigate('/login')}>
            Ir al Login Ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header de navegación */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>🍳 CookSync</h2>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <img 
              src={user?.fotoPerfil || '/default-avatar.png'} 
              alt="Avatar" 
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{user?.nombres} {user?.apellidos}</span>
              <span className="user-role">{user?.role?.nombre}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal del dashboard */}
      <main className="dashboard-main">
        {renderProfileByRole()}
      </main>
    </div>
  );
};

export default Dashboard;
