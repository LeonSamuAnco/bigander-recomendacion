import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaMapMarkerAlt, FaGlobe, FaExternalLinkAlt, FaPhone, FaStar, FaWhatsapp, FaInstagram, FaClock, FaCreditCard, FaTruck } from 'react-icons/fa';
import './CelularPurchaseOptions.css';

const CelularPurchaseOptions = ({ celular, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('online'); // online, physical
  const [platformVendors, setPlatformVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Cargar vendedores de la plataforma
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        // Categoría 15 = Celulares
        const response = await fetch('http://localhost:3002/vendors/by-category/15?limit=10');
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
      name: 'Linio',
      url: `https://www.linio.com.pe/search?q=${encodeURIComponent(celular.marca + ' ' + celular.modelo)}`,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Linio_logo.svg',
      description: 'Envío a todo el Perú'
    },
    {
      id: 2,
      name: 'Mercado Libre',
      url: `https://listado.mercadolibre.com.pe/${encodeURIComponent(celular.marca + '-' + celular.modelo)}`,
      logo: 'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__large_plus.png',
      description: 'Variedad de vendedores'
    },
    {
      id: 3,
      name: 'Ripley',
      url: `https://simple.ripley.com.pe/search/${encodeURIComponent(celular.marca + ' ' + celular.modelo)}`,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Ripley_logo.svg',
      description: 'Tienda departamental'
    },
    {
      id: 4,
      name: 'Saga Falabella',
      url: `https://www.falabella.com.pe/falabella-pe/search?Ntt=${encodeURIComponent(celular.marca + ' ' + celular.modelo)}`,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Saga_Falabella_logo.svg',
      description: 'Compra online con recojo en tienda'
    },
    {
      id: 5,
      name: 'Amazon',
      url: `https://www.amazon.com/s?k=${encodeURIComponent(celular.marca + ' ' + celular.modelo)}`,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      description: 'Envío internacional'
    }
  ];

  const physicalStores = [
    {
      id: 1,
      name: 'Tiendas Claro',
      address: 'Múltiples ubicaciones en Lima',
      phone: '0800-00-200',
      description: 'Operador con planes',
      mapsUrl: 'https://www.google.com/maps/search/Claro+tienda+Lima'
    },
    {
      id: 2,
      name: 'Tiendas Movistar',
      address: 'Múltiples ubicaciones en Lima',
      phone: '0800-00-123',
      description: 'Operador con planes',
      mapsUrl: 'https://www.google.com/maps/search/Movistar+tienda+Lima'
    },
    {
      id: 3,
      name: 'Tiendas Entel',
      address: 'Múltiples ubicaciones en Lima',
      phone: '0800-00-010',
      description: 'Operador con planes',
      mapsUrl: 'https://www.google.com/maps/search/Entel+tienda+Lima'
    },
    {
      id: 4,
      name: 'Plaza Vea',
      address: 'Centros comerciales',
      phone: '01-611-5000',
      description: 'Celulares liberados',
      mapsUrl: 'https://www.google.com/maps/search/Plaza+Vea+Lima'
    },
    {
      id: 5,
      name: 'Tiendas EFE',
      address: 'Polvos Azules y otros',
      phone: '01-332-3030',
      description: 'Tienda especializada',
      mapsUrl: 'https://www.google.com/maps/search/Tiendas+EFE+Lima'
    },
    {
      id: 6,
      name: 'Saga Falabella',
      address: 'Centros comerciales',
      phone: '01-611-5000',
      description: 'Tienda departamental',
      mapsUrl: 'https://www.google.com/maps/search/Saga+Falabella+Lima'
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
              <p>{celular.marca} {celular.modelo}</p>
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
                <p>Contacta directamente con vendedores verificados de nuestra plataforma</p>
              </div>
              {loadingVendors ? (
                <div className="loading-vendors">
                  <p>Cargando vendedores...</p>
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
                          <div className="vendor-address-container">
                            <p className="vendor-address">
                              <FaMapMarkerAlt /> {vendor.address}
                            </p>
                            <button
                              className="view-map-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = (vendor.latitud && vendor.longitud)
                                  ? `https://www.google.com/maps/search/?api=1&query=${vendor.latitud},${vendor.longitud}`
                                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.address)}`;
                                window.open(url, '_blank');
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#4299e1',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                textDecoration: 'underline',
                                marginLeft: '5px',
                                padding: 0
                              }}
                            >
                              Ver en Mapa
                            </button>
                          </div>
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
                          📦 {vendor.stats.totalRecipes} productos
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
                  <p>Aún no hay vendedores registrados en esta categoría.</p>
                  <p>¿Eres vendedor? ¡Regístrate y aparece aquí!</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'online' && (
            <div className="purchase-section">
              <div className="purchase-section-header">
                <h3>Tiendas en Línea</h3>
                <p>Compra desde casa con envío a domicilio</p>
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
                      Visitar Tienda
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
                <p>Visita una tienda cerca de ti</p>
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

export default CelularPurchaseOptions;
