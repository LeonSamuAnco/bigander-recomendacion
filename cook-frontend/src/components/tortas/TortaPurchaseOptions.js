import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaMapMarkerAlt, FaGlobe, FaExternalLinkAlt, FaPhone, FaStar, FaWhatsapp, FaInstagram, FaClock, FaCreditCard, FaTruck } from 'react-icons/fa';
import './TortaPurchaseOptions.css';

const TortaPurchaseOptions = ({ torta, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('online');
  const [platformVendors, setPlatformVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Cargar vendedores de la plataforma
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        // Categoría 16 = Tortas
        const response = await fetch('http://localhost:3002/vendors/by-category/16?limit=10');
        if (response.ok) {
          const data = await response.json();
          setPlatformVendors(data.vendors || []);
        }
      } catch (error) {
        console.error('Error cargando vendedores:', error);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  const onlineStores = [
    {
      id: 1,
      name: 'Rappi',
      url: `https://rappi.com.pe/search?query=${encodeURIComponent(torta.nombre)}`,
      description: 'Delivery en 30-45 minutos'
    },
    {
      id: 2,
      name: 'PedidosYa',
      url: `https://www.pedidosya.com.pe/busqueda?query=${encodeURIComponent(torta.nombre)}`,
      description: 'Envío rápido a domicilio'
    },
    {
      id: 3,
      name: 'Uber Eats',
      url: `https://www.ubereats.com/pe/search?q=${encodeURIComponent(torta.nombre)}`,
      description: 'Delivery express'
    },
    {
      id: 4,
      name: 'Glovo',
      url: `https://glovoapp.com/pe/es/search/?q=${encodeURIComponent(torta.nombre)}`,
      description: 'Entrega en minutos'
    },
    {
      id: 5,
      name: 'Mercado Libre',
      url: `https://listado.mercadolibre.com.pe/${encodeURIComponent(torta.nombre)}`,
      description: 'Variedad de vendedores'
    }
  ];

  const physicalStores = [
    {
      id: 1,
      name: torta.vendedor || 'Pastelería Local',
      address: 'Múltiples ubicaciones en Lima',
      phone: '01-234-5678',
      description: 'Especialistas en tortas personalizadas',
      mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(torta.vendedor || 'pastelería Lima')}`
    },
    {
      id: 2,
      name: 'Wong',
      address: 'Av. Benavides 123, Miraflores',
      phone: '01-611-5000',
      description: 'Sección de panadería',
      mapsUrl: 'https://www.google.com/maps/search/Wong+Lima'
    },
    {
      id: 3,
      name: 'Metro',
      address: 'Av. Javier Prado 456, San Isidro',
      phone: '01-611-5000',
      description: 'Tortas y pasteles variados',
      mapsUrl: 'https://www.google.com/maps/search/Metro+Lima'
    },
    {
      id: 4,
      name: 'Saga Falabella',
      address: 'Centros comerciales',
      phone: '01-611-5000',
      description: 'Sección gourmet',
      mapsUrl: 'https://www.google.com/maps/search/Saga+Falabella+Lima'
    },
    {
      id: 5,
      name: 'Plaza Vea',
      address: 'Múltiples ubicaciones',
      phone: '01-611-5000',
      description: 'Panadería y pastelería',
      mapsUrl: 'https://www.google.com/maps/search/Plaza+Vea+Lima'
    },
    {
      id: 6,
      name: 'Pastelerías Artesanales',
      address: 'Miraflores, San Isidro, Barranco',
      phone: 'Consultar por ubicación',
      description: 'Tortas premium y personalizadas',
      mapsUrl: 'https://www.google.com/maps/search/pastelería+artesanal+Lima'
    }
  ];

  return (
    <div className="purchase-modal-overlay" onClick={onClose}>
      <div className="purchase-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="purchase-modal-header">
          <div className="purchase-modal-title">
            <FaShoppingCart />
            <div>
              <h2>Dónde Comprar</h2>
              <p>{torta.nombre}</p>
              {torta.sabor && <span className="modal-sabor">Sabor: {torta.sabor}</span>}
            </div>
          </div>
          <button className="purchase-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="purchase-tabs">
          <button
            className={`purchase-tab ${selectedTab === 'platform' ? 'active' : ''}`}
            onClick={() => setSelectedTab('platform')}
          >
            <FaShoppingCart />
            Vendedores CookSync
          </button>
          <button
            className={`purchase-tab ${selectedTab === 'online' ? 'active' : ''}`}
            onClick={() => setSelectedTab('online')}
          >
            <FaGlobe />
            Comprar en Línea
          </button>
          <button
            className={`purchase-tab ${selectedTab === 'physical' ? 'active' : ''}`}
            onClick={() => setSelectedTab('physical')}
          >
            <FaMapMarkerAlt />
            Tiendas Físicas
          </button>
        </div>

        <div className="purchase-modal-body">
          {selectedTab === 'platform' && (
            <div className="purchase-section">
              <div className="purchase-section-header">
                <h3>Vendedores de CookSync</h3>
                <p>Contacta directamente con pastelerías verificadas de nuestra plataforma</p>
              </div>
              {loadingVendors ? (
                <div className="loading-vendors">
                  <p>Cargando pastelerías...</p>
                </div>
              ) : platformVendors.length > 0 ? (
                <div className="platform-vendors-grid">
                  {platformVendors.map((vendor) => (
                    <div key={vendor.id} className="platform-vendor-card">
                      <div className="vendor-header">
                        {vendor.photo ? (
                          <img src={vendor.photo} alt={vendor.name} className="vendor-photo" />
                        ) : (
                          <div className="vendor-photo-placeholder">
                            {vendor.name.charAt(0)}
                          </div>
                        )}
                        <div className="vendor-info">
                          <h4>{vendor.businessName}</h4>
                          {vendor.stats.averageRating > 0 && (
                            <div className="vendor-rating">
                              <FaStar className="star-icon" />
                              <span>{vendor.stats.averageRating.toFixed(1)}</span>
                              <span className="reviews-count">({vendor.stats.totalReviews} reseñas)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {vendor.bio && (
                        <p className="vendor-bio">{vendor.bio}</p>
                      )}
                      <div className="vendor-details">
                        {vendor.address && (
                          <p className="vendor-address">
                            <FaMapMarkerAlt /> {vendor.address}
                          </p>
                        )}
                        {vendor.horarioAtencion && (
                          <p className="vendor-detail">
                            <FaClock /> {vendor.horarioAtencion}
                          </p>
                        )}
                        {vendor.tipoServicio && (
                          <p className="vendor-detail">
                            <FaTruck /> {vendor.tipoServicio}
                          </p>
                        )}
                        {vendor.metodosPago && (
                          <p className="vendor-detail">
                            <FaCreditCard /> {vendor.metodosPago}
                          </p>
                        )}
                        {vendor.phone && (
                          <p className="vendor-phone">
                            <FaPhone /> {vendor.phone}
                          </p>
                        )}
                        <p className="vendor-products">
                          🎂 {vendor.stats.totalRecipes} productos
                        </p>
                      </div>
                      <div className="vendor-actions">
                        {vendor.whatsapp && (
                          <a
                            href={`https://wa.me/51${vendor.whatsapp.replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vendor-contact-btn whatsapp"
                            style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white' }}
                          >
                            <FaWhatsapp /> WhatsApp
                          </a>
                        )}
                        {vendor.instagram && (
                          <a
                            href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vendor-contact-btn instagram"
                            style={{ backgroundColor: '#E1306C', borderColor: '#E1306C', color: 'white' }}
                          >
                            <FaInstagram /> Instagram
                          </a>
                        )}
                        {vendor.phone && !vendor.whatsapp && (
                          <a
                            href={`tel:${vendor.phone}`}
                            className="vendor-contact-btn"
                          >
                            <FaPhone /> Llamar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-vendors">
                  <p>Aún no hay pastelerías registradas en esta categoría.</p>
                  <p>¿Eres pastelero? ¡Regístrate y aparece aquí!</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'online' && (
            <div className="purchase-section">
              <div className="purchase-section-header">
                <h3>Tiendas en Línea</h3>
                <p>Ordena tortas con delivery a domicilio</p>
              </div>
              <div className="online-stores-grid">
                {onlineStores.map((store) => (
                  <div key={store.id} className="online-store-card">
                    <div className="store-info">
                      <h4>{store.name}</h4>
                      <p>{store.description}</p>
                    </div>
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-visit-btn"
                    >
                      <FaExternalLinkAlt />
                      Ordenar Ahora
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'physical' && (
            <div className="purchase-section">
              <div className="purchase-section-header">
                <h3>Tiendas Físicas</h3>
                <p>Visita una pastelería cerca de ti</p>
              </div>
              <div className="physical-stores-list">
                {physicalStores.map((store) => (
                  <div key={store.id} className="physical-store-card">
                    <div className="store-details">
                      <h4>{store.name}</h4>
                      <p className="store-address">
                        <FaMapMarkerAlt /> {store.address}
                      </p>
                      <p className="store-phone">
                        <FaPhone /> {store.phone}
                      </p>
                      <p className="store-description">{store.description}</p>
                    </div>
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-maps-btn"
                    >
                      <FaMapMarkerAlt />
                      Ver en Mapa
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TortaPurchaseOptions;
