import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './VendorProfile.css';

const VendorProfile = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadAnalytics();
  }, [user.id]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3002/vendors/${user.id}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProducts([]);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3002/vendors/${user.id}/orders`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setOrders([]);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:3002/vendors/${user.id}/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '🛍️', label: 'Productos' },
    { id: 'orders', icon: '📦', label: 'Pedidos' },
    { id: 'inventory', icon: '📋', label: 'Inventario' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'customers', icon: '👥', label: 'Clientes' },
    { id: 'marketing', icon: '📢', label: 'Marketing' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'inventory':
        return renderInventory();
      case 'analytics':
        return renderAnalytics();
      case 'customers':
        return renderCustomers();
      case 'marketing':
        return renderMarketing();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>📊 Dashboard de Ventas</h2>
        <p>Resumen de tu negocio en CookSync</p>
      </div>
      
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>{products.length || 0}</h3>
            <p>Productos Activos</p>
            <span className="stat-change positive">+3 esta semana</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{orders.length || 0}</h3>
            <p>Pedidos Totales</p>
            <span className="stat-change positive">+15% vs mes anterior</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>S/ {analytics.totalSales || 2850}</h3>
            <p>Ventas del Mes</p>
            <span className="stat-change positive">+28% vs mes anterior</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>4.8</h3>
            <p>Rating Promedio</p>
            <span className="stat-change neutral">Excelente</span>
          </div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h3>📈 Ventas Recientes</h3>
          <div className="sales-chart">
            <div className="chart-placeholder">
              <p>Gráfico de ventas de los últimos 7 días</p>
              <div className="mock-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>🔔 Alertas Importantes</h3>
          <div className="alerts-list">
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">3 productos con stock bajo</span>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">📦</span>
              <span className="alert-text">5 pedidos pendientes de envío</span>
            </div>
            <div className="alert-item success">
              <span className="alert-icon">⭐</span>
              <span className="alert-text">2 nuevas reseñas positivas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>🛍️ Gestión de Productos</h2>
        <button className="primary-btn">+ Nuevo Producto</button>
      </div>
      
      <div className="products-grid">
        <div className="product-card">
          <div className="product-image">🍽️</div>
          <div className="product-info">
            <h4>Ceviche Clásico</h4>
            <p>S/ 25.00</p>
            <span className="product-status active">Activo</span>
          </div>
          <div className="product-actions">
            <button className="edit-btn">Editar</button>
            <button className="view-btn">Ver</button>
          </div>
        </div>
        <div className="product-card">
          <div className="product-image">🥘</div>
          <div className="product-info">
            <h4>Lomo Saltado</h4>
            <p>S/ 32.00</p>
            <span className="product-status active">Activo</span>
          </div>
          <div className="product-actions">
            <button className="edit-btn">Editar</button>
            <button className="view-btn">Ver</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>📦 Gestión de Pedidos</h2>
      </div>
      
      <div className="orders-table">
        <div className="table-header">
          <span>Pedido</span>
          <span>Cliente</span>
          <span>Fecha</span>
          <span>Total</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        <div className="table-row">
          <span>#001</span>
          <span>Juan Pérez</span>
          <span>22/09/2024</span>
          <span>S/ 45.00</span>
          <span className="status-badge pending">Pendiente</span>
          <div className="action-buttons">
            <button className="action-btn">Procesar</button>
            <button className="action-btn">Ver</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>📋 Control de Inventario</h2>
      </div>
      <div className="inventory-content">
        <p>Módulo de inventario en desarrollo...</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>📈 Analytics de Ventas</h2>
      </div>
      <div className="analytics-content">
        <p>Módulo de analytics en desarrollo...</p>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>👥 Gestión de Clientes</h2>
      </div>
      <div className="customers-content">
        <p>Módulo de clientes en desarrollo...</p>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>📢 Marketing y Promociones</h2>
      </div>
      <div className="marketing-content">
        <p>Módulo de marketing en desarrollo...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="vendor-content-section">
      <div className="section-header">
        <h2>⚙️ Configuración de Tienda</h2>
      </div>
      <div className="settings-content">
        <p>Módulo de configuración en desarrollo...</p>
      </div>
    </div>
  );

  return (
    <div className="vendor-panel">
      {/* Sidebar */}
      <div className="vendor-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏪</span>
            <span className="logo-text">Mi Tienda</span>
          </div>
          <div className="vendor-info">
            <img 
              src={user.fotoPerfil || '/vendor-avatar.png'} 
              alt="Vendor"
              className="vendor-avatar"
            />
            <div className="vendor-details">
              <span className="vendor-name">{user.nombres}</span>
              <span className="vendor-role">Vendedor</span>
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
      <div className="vendor-main">
        <div className="vendor-header">
          <div className="header-title">
            <h1>Panel de Vendedor</h1>
            <p>Gestiona tu tienda en CookSync</p>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">5</span>
            </button>
            <button className="profile-btn">
              <img src={user.fotoPerfil || '/vendor-avatar.png'} alt="Profile" />
            </button>
          </div>
        </div>

        <div className="vendor-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
