import React, { useState, useEffect } from 'react';
import './ProfileStyles.css';

const VendorProfile = ({ user }) => {
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadVendorData();
    loadProducts();
    loadOrders();
    loadAnalytics();
  }, [user.id]);

  const loadVendorData = async () => {
    try {
      const response = await fetch(`http://localhost:3002/vendors/${user.id}`);
      const data = await response.json();
      setVendorData(data);
    } catch (error) {
      console.error('Error cargando datos del vendedor:', error);
    }
  };

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

  return (
    <div className="profile-container vendor-profile">
      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.fotoPerfil || '/vendor-avatar.png'} 
            alt="Avatar"
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h1>Panel de Vendedor 🏪</h1>
          <p className="profile-subtitle">{user.nombres} {user.apellidos}</p>
          <div className="vendor-stats">
            <div className="stat-item">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Pedidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">S/ {analytics.totalSales || 0}</span>
              <span className="stat-label">Ventas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard del vendedor */}
      <div className="dashboard-grid">
        {/* Resumen de ventas */}
        <div className="dashboard-card sales-card">
          <h3>💰 Resumen de Ventas</h3>
          <div className="sales-summary">
            <div className="sales-metric">
              <h4>Hoy</h4>
              <p className="sales-amount">S/ {analytics.todaySales || 0}</p>
              <small className="sales-change">+{analytics.todayChange || 0}%</small>
            </div>
            <div className="sales-metric">
              <h4>Esta Semana</h4>
              <p className="sales-amount">S/ {analytics.weekSales || 0}</p>
              <small className="sales-change">+{analytics.weekChange || 0}%</small>
            </div>
            <div className="sales-metric">
              <h4>Este Mes</h4>
              <p className="sales-amount">S/ {analytics.monthSales || 0}</p>
              <small className="sales-change">+{analytics.monthChange || 0}%</small>
            </div>
          </div>
        </div>

        {/* Pedidos pendientes */}
        <div className="dashboard-card orders-card">
          <h3>📦 Pedidos Pendientes</h3>
          <div className="orders-list">
            {orders.filter(order => order.estado === 'PENDIENTE').slice(0, 5).map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <h4>Pedido #{order.id}</h4>
                  <p>{order.cliente.nombres} {order.cliente.apellidos}</p>
                  <small>{order.fechaPedido}</small>
                </div>
                <div className="order-actions">
                  <span className="order-amount">S/ {order.total}</span>
                  <button className="process-btn">Procesar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">Ver todos los pedidos</button>
        </div>

        {/* Productos más vendidos */}
        <div className="dashboard-card top-products-card">
          <h3>🏆 Productos Más Vendidos</h3>
          <div className="products-ranking">
            {analytics.topProducts?.slice(0, 5).map((product, index) => (
              <div key={product.id} className="product-rank-item">
                <span className="rank-number">#{index + 1}</span>
                <div className="product-info">
                  <h4>{product.nombre}</h4>
                  <p>{product.ventas} vendidos</p>
                </div>
                <span className="product-revenue">S/ {product.ingresos}</span>
              </div>
            )) || <p className="empty-state">No hay datos de ventas aún</p>}
          </div>
        </div>

        {/* Inventario */}
        <div className="dashboard-card inventory-card">
          <h3>📊 Estado del Inventario</h3>
          <div className="inventory-summary">
            <div className="inventory-metric">
              <h4>Stock Bajo</h4>
              <p className="metric-number">{analytics.lowStock || 0}</p>
              <small>productos</small>
            </div>
            <div className="inventory-metric">
              <h4>Sin Stock</h4>
              <p className="metric-number">{analytics.outOfStock || 0}</p>
              <small>productos</small>
            </div>
            <div className="inventory-metric">
              <h4>Valor Total</h4>
              <p className="metric-number">S/ {analytics.inventoryValue || 0}</p>
              <small>inventario</small>
            </div>
          </div>
          <button className="manage-inventory-btn">Gestionar Inventario</button>
        </div>

        {/* Acciones rápidas del vendedor */}
        <div className="dashboard-card vendor-actions-card">
          <h3>⚡ Acciones Rápidas</h3>
          <div className="vendor-actions">
            <button className="vendor-action-btn">
              <span className="action-icon">➕</span>
              Agregar Producto
            </button>
            <button className="vendor-action-btn">
              <span className="action-icon">📋</span>
              Gestionar Pedidos
            </button>
            <button className="vendor-action-btn">
              <span className="action-icon">📈</span>
              Ver Reportes
            </button>
            <button className="vendor-action-btn">
              <span className="action-icon">💬</span>
              Mensajes Clientes
            </button>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="dashboard-card notifications-card">
          <h3>🔔 Notificaciones</h3>
          <div className="notifications-list">
            <div className="notification-item urgent">
              <span className="notification-icon">⚠️</span>
              <div className="notification-text">
                <p>5 productos con stock bajo</p>
                <small>Hace 2 horas</small>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-icon">📦</span>
              <div className="notification-text">
                <p>3 nuevos pedidos recibidos</p>
                <small>Hace 30 min</small>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-icon">⭐</span>
              <div className="notification-text">
                <p>Nueva reseña de 5 estrellas</p>
                <small>Hace 1 hora</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
