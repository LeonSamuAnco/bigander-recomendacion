import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import adminService from '../../services/adminService';
import './AdminProfile.css';

const AdminProfile = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [systemStats, setSystemStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);
  const [reports, setReports] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [recipesStats, setRecipesStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Primero probar la conexión
      console.log('Testing admin connection...');
      const testResult = await adminService.testConnection();
      console.log('Admin connection test result:', testResult);
      
      // Luego cargar datos reales
      await Promise.all([
        loadSystemStats(),
        loadRecentUsers(),
        loadSystemRoles(),
        loadRecipes(),
      ]);
    } catch (error) {
      showNotification('Error al cargar datos del sistema', 'error');
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const stats = await adminService.getSystemStats();
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading system stats:', error);
      // Usar datos de prueba si falla la conexión
      setSystemStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        usersByRole: [],
        recentUsers: 0,
        systemHealth: {
          status: 'Conectando...',
          uptime: 0,
          memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0 }
        }
      });
      showNotification('Usando datos de prueba - Verificar conexión backend', 'warning');
    }
  };

  const loadRecentUsers = async () => {
    try {
      const users = await adminService.getRecentUsers(5);
      setRecentUsers(users);
    } catch (error) {
      console.error('Error loading recent users:', error);
      // Usar datos de prueba si falla la conexión
      setRecentUsers([]);
      showNotification('Error al cargar usuarios recientes', 'error');
    }
  };

  const loadAllUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const result = await adminService.getAllUsers(page, 10, search);
      setAllUsers(result);
      setUsersPage(page);
      setUsersSearch(search);
    } catch (error) {
      console.error('Error loading all users:', error);
      showNotification('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemRoles = async () => {
    try {
      const roles = await adminService.getSystemRoles();
      setSystemRoles(roles);
    } catch (error) {
      console.error('Error loading system roles:', error);
      showNotification('Error al cargar roles del sistema', 'error');
    }
  };

  const loadReports = async () => {
    try {
      const reportsData = await adminService.getSystemReports();
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
      showNotification('Error al cargar reportes', 'error');
    }
  };

  const loadRecipes = async () => {
    try {
      console.log('Frontend: Loading recipes...');
      
      // Método 1: Intentar endpoint directo de recetas
      try {
        console.log('Trying direct recipes endpoint...');
        const directResponse = await fetch('http://localhost:3002/recipes');
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log('Direct recipes response:', directData);
          
          if (directData.recipes && Array.isArray(directData.recipes)) {
            setRecipes(directData.recipes);
            showNotification(`✅ ${directData.recipes.length} recetas cargadas desde API principal`, 'success');
            return;
          }
        } else {
          console.log('Direct endpoint status:', directResponse.status);
        }
      } catch (directError) {
        console.log('Direct endpoint error:', directError.message);
      }
      
      // Método 2: Intentar endpoint de admin
      try {
        console.log('Trying admin recipes endpoint...');
        const adminData = await adminService.getAllRecipes(1, 50);
        console.log('Admin recipes response:', adminData);
        
        if (adminData && adminData.recipes && Array.isArray(adminData.recipes)) {
          setRecipes(adminData.recipes);
          showNotification(`✅ ${adminData.recipes.length} recetas cargadas desde Admin API`, 'success');
          return;
        }
      } catch (adminError) {
        console.log('Admin endpoint error:', adminError.message);
      }
      
      // Método 3: Datos de prueba como último recurso
      console.log('Using fallback test data...');
      const testRecipes = [
        {
          id: 1,
          titulo: 'Ceviche Clásico Peruano',
          tiempoPreparacion: 30,
          porciones: 4,
          dificultad: { nombre: 'Fácil' },
          autor: { nombres: 'Chef Admin' },
          imagenUrl: null,
          descripcion: 'Delicioso ceviche tradicional peruano'
        },
        {
          id: 2,
          titulo: 'Lomo Saltado Tradicional',
          tiempoPreparacion: 45,
          porciones: 6,
          dificultad: { nombre: 'Medio' },
          autor: { nombres: 'Chef Admin' },
          imagenUrl: null,
          descripcion: 'Clásico lomo saltado peruano'
        },
        {
          id: 3,
          titulo: 'Ají de Gallina',
          tiempoPreparacion: 60,
          porciones: 8,
          dificultad: { nombre: 'Medio' },
          autor: { nombres: 'Chef Admin' },
          imagenUrl: null,
          descripcion: 'Tradicional ají de gallina peruano'
        }
      ];
      
      setRecipes(testRecipes);
      showNotification('⚠️ Usando datos de prueba - Backend no disponible', 'warning');
      
    } catch (error) {
      console.error('Error general loading recipes:', error);
      setRecipes([]);
      showNotification('❌ Error al cargar recetas', 'error');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const result = await adminService.toggleUserStatus(userId);
      showNotification(result.message, 'success');
      // Recargar usuarios
      if (activeSection === 'users') {
        loadAllUsers(usersPage, usersSearch);
      }
      loadRecentUsers(); // Actualizar usuarios recientes también
    } catch (error) {
      console.error('Error toggling user status:', error);
      showNotification('Error al cambiar estado del usuario', 'error');
    }
  };

  const handleChangeUserRole = async (userId, newRoleId) => {
    try {
      const result = await adminService.changeUserRole(userId, newRoleId);
      showNotification(result.message, 'success');
      // Recargar usuarios
      if (activeSection === 'users') {
        loadAllUsers(usersPage, usersSearch);
      }
      loadRecentUsers(); // Actualizar usuarios recientes también
    } catch (error) {
      console.error('Error changing user role:', error);
      showNotification('Error al cambiar rol del usuario', 'error');
    }
  };

  const handleToggleRecipeStatus = async (recipeId) => {
    try {
      const result = await adminService.toggleRecipeStatus(recipeId);
      showNotification(result.message || 'Estado de receta cambiado', 'success');
      // Recargar recetas
      loadRecipes();
    } catch (error) {
      console.error('Error toggling recipe status:', error);
      showNotification('Error al cambiar estado de la receta', 'error');
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', active: true },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'recipes', icon: '🍽️', label: 'Recetas' },
    { id: 'orders', icon: '🛒', label: 'Pedidos' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'reports', icon: '📋', label: 'Reportes' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
    { id: 'security', icon: '🔒', label: 'Seguridad' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'recipes':
        return renderRecipes();
      case 'orders':
        return renderOrders();
      case 'analytics':
        return renderAnalytics();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      case 'security':
        return renderSecurity();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>📊 Dashboard General</h2>
        <p>Resumen ejecutivo del sistema CookSync</p>
      </div>
      
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{systemStats.totalUsers || 0}</h3>
            <p>Usuarios Totales</p>
            <span className="stat-change positive">+12% este mes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>{systemStats.totalRecipes || 45}</h3>
            <p>Recetas Activas</p>
            <span className="stat-change positive">+8% esta semana</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>S/ {systemStats.totalSales || 12500}</h3>
            <p>Ventas del Mes</p>
            <span className="stat-change positive">+23% vs mes anterior</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>98.5%</h3>
            <p>Uptime Sistema</p>
            <span className="stat-change neutral">Excelente</span>
          </div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h3>🏥 Estado del Sistema</h3>
          <div className="system-status">
            <div className="status-item healthy">
              <span className="status-dot"></span>
              <span>Base de Datos</span>
              <span className="status-text">Operativa</span>
            </div>
            <div className="status-item healthy">
              <span className="status-dot"></span>
              <span>API</span>
              <span className="status-text">Funcionando</span>
            </div>
            <div className="status-item warning">
              <span className="status-dot"></span>
              <span>Almacenamiento</span>
              <span className="status-text">78% usado</span>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>📈 Actividad Reciente</h3>
          <div className="activity-feed">
            <div className="activity-item">
              <span className="activity-time">10:30</span>
              <span className="activity-desc">Nuevo usuario registrado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">10:15</span>
              <span className="activity-desc">Receta aprobada</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">09:45</span>
              <span className="activity-desc">Backup completado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>👥 Gestión de Usuarios</h2>
        <button className="primary-btn">+ Nuevo Usuario</button>
      </div>
      
      <div className="users-table">
        <div className="table-header">
          <span>Usuario</span>
          <span>Email</span>
          <span>Rol</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {(recentUsers || []).map(user => (
          <div key={user.id} className="table-row">
            <div className="user-cell">
              <img src={user.fotoPerfil || '/default-avatar.png'} alt="Avatar" />
              <span>{user.nombres} {user.apellidos}</span>
            </div>
            <span>{user.email}</span>
            <span className="role-badge">{user.role?.nombre || 'Cliente'}</span>
            <span className="status-badge active">Activo</span>
            <div className="action-buttons">
              <button className="action-btn">Ver</button>
              <button className="action-btn">Editar</button>
              <button className="action-btn danger">Suspender</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecipes = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>🍽️ Gestión de Recetas</h2>
        <button className="primary-btn" onClick={() => navigate('/recipes/create')}>+ Nueva Receta</button>
      </div>
      
      {/* Estadísticas de recetas */}
      <div className="recipes-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{recipesStats.totalRecipes || recipes.length}</h3>
            <p>Total Recetas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{recipesStats.activeRecipes || recipes.length}</h3>
            <p>Recetas Activas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{recipesStats.totalViews || 0}</h3>
            <p>Total Visualizaciones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{recipesStats.averageRating || 4.5}</h3>
            <p>Rating Promedio</p>
          </div>
        </div>
      </div>
      
      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image">
                {recipe.imagenUrl ? (
                  <img src={recipe.imagenUrl} alt={recipe.titulo} />
                ) : (
                  <div className="recipe-placeholder">🍽️</div>
                )}
              </div>
              <div className="recipe-status approved">Aprobada</div>
              <h4>{recipe.titulo}</h4>
              <p>Por: {recipe.autor?.nombres || 'Chef Admin'}</p>
              <div className="recipe-info">
                <span>⏱️ {recipe.tiempoPreparacion}min</span>
                <span>👥 {recipe.porciones} porciones</span>
                <span>📊 {recipe.dificultad?.nombre || 'Medio'}</span>
              </div>
              <div className="recipe-actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                >
                  Editar
                </button>
                <button 
                  className="view-btn"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  Ver
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleToggleRecipeStatus(recipe.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes">
            <p>No hay recetas disponibles</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="primary-btn" onClick={() => loadRecipes()}>
                🔄 Recargar Recetas
              </button>
              <button 
                className="primary-btn" 
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:3002/recipes');
                    const data = await response.json();
                    console.log('Direct test:', data);
                    showNotification(`Test: ${data.recipes?.length || 0} recetas encontradas`, 'info');
                  } catch (error) {
                    console.error('Test error:', error);
                    showNotification('Test falló: Backend no disponible', 'error');
                  }
                }}
              >
                🧪 Test Directo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>🛒 Gestión de Pedidos</h2>
      </div>
      <div className="orders-content">
        <p>Módulo de pedidos en desarrollo...</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>📈 Analytics</h2>
      </div>
      <div className="analytics-content">
        <p>Módulo de analytics en desarrollo...</p>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>📋 Reportes</h2>
      </div>
      <div className="reports-content">
        <p>Módulo de reportes en desarrollo...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>⚙️ Configuración</h2>
      </div>
      <div className="settings-content">
        <p>Módulo de configuración en desarrollo...</p>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>🔒 Seguridad</h2>
      </div>
      <div className="security-content">
        <p>Módulo de seguridad en desarrollo...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">CookSync</span>
          </div>
          <div className="admin-info">
            <img 
              src={user.fotoPerfil || '/admin-avatar.png'} 
              alt="Admin"
              className="admin-avatar"
            />
            <div className="admin-details">
              <span className="admin-name">{user.nombres}</span>
              <span className="admin-role">Administrador</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            logout();
            showNotification("Sesión cerrada exitosamente", "success");
            navigate('/', { replace: true });
          }}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <div className="header-title">
            <h1>Panel de Administración</h1>
            <p>Gestiona tu plataforma CookSync</p>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <button className="profile-btn">
              <img src={user.fotoPerfil || '/admin-avatar.png'} alt="Profile" />
            </button>
          </div>
        </div>

        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
