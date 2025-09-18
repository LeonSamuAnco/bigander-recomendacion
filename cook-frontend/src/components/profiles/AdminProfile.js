import React, { useState, useEffect } from 'react';
import './ProfileStyles.css';

const AdminProfile = ({ user }) => {
  const [systemStats, setSystemStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadSystemStats();
    loadRecentUsers();
    loadSystemHealth();
    loadReports();
  }, []);

  const loadSystemStats = async () => {
    try {
      const response = await fetch('http://localhost:3002/admin/system-stats');
      const data = await response.json();
      setSystemStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas del sistema:', error);
    }
  };

  const loadRecentUsers = async () => {
    try {
      const response = await fetch('http://localhost:3002/admin/recent-users');
      const data = await response.json();
      setRecentUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando usuarios recientes:', error);
      setRecentUsers([]);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:3002/admin/system-health');
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Error cargando salud del sistema:', error);
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch('http://localhost:3002/admin/reports');
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReports([]);
    }
  };

  return (
    <div className="profile-container admin-profile">
      {/* Header del administrador */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.fotoPerfil || '/admin-avatar.png'} 
            alt="Avatar"
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h1>Panel de Administración 🛡️</h1>
          <p className="profile-subtitle">Administrador: {user.nombres} {user.apellidos}</p>
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-number">{systemStats.totalUsers || 0}</span>
              <span className="stat-label">Usuarios</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{systemStats.totalRecipes || 0}</span>
              <span className="stat-label">Recetas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{systemStats.totalOrders || 0}</span>
              <span className="stat-label">Pedidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard del administrador */}
      <div className="dashboard-grid">
        {/* Estadísticas del sistema */}
        <div className="dashboard-card system-stats-card">
          <h3>📊 Estadísticas del Sistema</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <h4>Usuarios Activos</h4>
              <p className="stat-value">{systemStats.activeUsers || 0}</p>
              <small className="stat-change">+{systemStats.userGrowth || 0}% este mes</small>
            </div>
            <div className="stat-box">
              <h4>Recetas Publicadas</h4>
              <p className="stat-value">{systemStats.publishedRecipes || 0}</p>
              <small className="stat-change">+{systemStats.recipeGrowth || 0}% esta semana</small>
            </div>
            <div className="stat-box">
              <h4>Ventas Totales</h4>
              <p className="stat-value">S/ {systemStats.totalSales || 0}</p>
              <small className="stat-change">+{systemStats.salesGrowth || 0}% este mes</small>
            </div>
            <div className="stat-box">
              <h4>Ingresos Plataforma</h4>
              <p className="stat-value">S/ {systemStats.platformRevenue || 0}</p>
              <small className="stat-change">+{systemStats.revenueGrowth || 0}% este mes</small>
            </div>
          </div>
        </div>

        {/* Salud del sistema */}
        <div className="dashboard-card system-health-card">
          <h3>🏥 Salud del Sistema</h3>
          <div className="health-metrics">
            <div className="health-item">
              <span className="health-label">Base de Datos</span>
              <span className={`health-status ${systemHealth.database || 'healthy'}`}>
                {systemHealth.database === 'healthy' ? '✅ Saludable' : '⚠️ Problemas'}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Servidor</span>
              <span className={`health-status ${systemHealth.server || 'healthy'}`}>
                {systemHealth.server === 'healthy' ? '✅ Operativo' : '⚠️ Problemas'}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">API</span>
              <span className={`health-status ${systemHealth.api || 'healthy'}`}>
                {systemHealth.api === 'healthy' ? '✅ Funcionando' : '⚠️ Lenta'}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Almacenamiento</span>
              <span className="health-status">
                📊 {systemHealth.storageUsed || 0}% usado
              </span>
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div className="dashboard-card recent-users-card">
          <h3>👥 Usuarios Recientes</h3>
          <div className="users-list">
            {(recentUsers || []).slice(0, 5).map(user => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  <img src={user.fotoPerfil || '/default-avatar.png'} alt="Avatar" />
                </div>
                <div className="user-info">
                  <h4>{user.nombres} {user.apellidos}</h4>
                  <p>{user.role?.nombre || user.rol?.nombre || 'Sin rol'} • {user.email}</p>
                  <small>Registrado: {user.createdAt}</small>
                </div>
                <div className="user-actions">
                  <button className="user-action-btn">Ver</button>
                  <button className="user-action-btn">Editar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">Ver todos los usuarios</button>
        </div>

        {/* Reportes y alertas */}
        <div className="dashboard-card reports-card">
          <h3>📋 Reportes y Alertas</h3>
          <div className="reports-list">
            <div className="report-item urgent">
              <span className="report-icon">🚨</span>
              <div className="report-text">
                <h4>Actividad Sospechosa</h4>
                <p>3 intentos de login fallidos detectados</p>
                <small>Hace 15 min</small>
              </div>
            </div>
            <div className="report-item">
              <span className="report-icon">📈</span>
              <div className="report-text">
                <h4>Pico de Tráfico</h4>
                <p>200% más visitas que el promedio</p>
                <small>Hace 1 hora</small>
              </div>
            </div>
            <div className="report-item">
              <span className="report-icon">💰</span>
              <div className="report-text">
                <h4>Meta de Ventas</h4>
                <p>85% de la meta mensual alcanzada</p>
                <small>Hace 2 horas</small>
              </div>
            </div>
          </div>
        </div>

        {/* Herramientas de administración */}
        <div className="dashboard-card admin-tools-card">
          <h3>🛠️ Herramientas de Administración</h3>
          <div className="admin-tools">
            <button className="admin-tool-btn">
              <span className="tool-icon">👥</span>
              Gestionar Usuarios
            </button>
            <button className="admin-tool-btn">
              <span className="tool-icon">🍽️</span>
              Moderar Recetas
            </button>
            <button className="admin-tool-btn">
              <span className="tool-icon">📊</span>
              Generar Reportes
            </button>
            <button className="admin-tool-btn">
              <span className="tool-icon">⚙️</span>
              Configuración Sistema
            </button>
            <button className="admin-tool-btn">
              <span className="tool-icon">🔒</span>
              Seguridad
            </button>
            <button className="admin-tool-btn">
              <span className="tool-icon">💾</span>
              Backup Base Datos
            </button>
          </div>
        </div>

        {/* Actividad del sistema */}
        <div className="dashboard-card system-activity-card">
          <h3>🔄 Actividad del Sistema</h3>
          <div className="activity-timeline">
            <div className="activity-item">
              <span className="activity-time">10:30</span>
              <span className="activity-description">Nuevo usuario registrado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">10:15</span>
              <span className="activity-description">Receta aprobada por moderador</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">09:45</span>
              <span className="activity-description">Backup automático completado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">09:30</span>
              <span className="activity-description">Pago procesado exitosamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
