import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaMapMarkerAlt, FaGlobe, FaExternalLinkAlt, FaPhone, FaStar, FaWhatsapp, FaInstagram, FaClock, FaCreditCard, FaTruck } from 'react-icons/fa';
import './DeportePurchaseOptions.css';

const DeportePurchaseOptions = ({ deporte, onClose }) => {
    const [selectedTab, setSelectedTab] = useState('online');
    const [platformVendors, setPlatformVendors] = useState([]);
    const [loadingVendors, setLoadingVendors] = useState(true);

    // Cargar vendedores de la plataforma
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoadingVendors(true);
                // Categoría 19 = Deportes
                const response = await fetch('http://localhost:3002/vendors/by-category/19?limit=10');
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
            name: 'Marathon',
            url: `https://www.marathon.store/pe/search/?text=${encodeURIComponent(deporte.items?.nombre || '')}`,
            description: 'Tienda deportiva especializada'
        },
        {
            id: 2,
            name: 'Triathlon Sport',
            url: `https://www.triathlon.com.pe/busqueda?q=${encodeURIComponent(deporte.items?.nombre || '')}`,
            description: 'Equipamiento y ropa deportiva'
        },
        {
            id: 3,
            name: 'Falabella',
            url: `https://www.falabella.com.pe/falabella-pe/search?Ntt=${encodeURIComponent(deporte.items?.nombre || '')}`,
            description: 'Departamento de deportes'
        },
        {
            id: 4,
            name: 'Ripley',
            url: `https://simple.ripley.com.pe/search/${encodeURIComponent(deporte.items?.nombre || '')}`,
            description: 'Variedad de marcas deportivas'
        },
        {
            id: 5,
            name: 'Mercado Libre',
            url: `https://listado.mercadolibre.com.pe/${encodeURIComponent(deporte.items?.nombre || '')}`,
            description: 'Vendedores verificados'
        }
    ];

    const physicalStores = [
        {
            id: 1,
            name: 'Marathon Sports',
            address: 'Real Plaza Arequipa',
            phone: '054-256789',
            description: 'Tienda oficial',
            mapsUrl: 'https://www.google.com/maps/search/Marathon+Sports+Arequipa'
        },
        {
            id: 2,
            name: 'Triathlon',
            address: 'Mall Aventura Porongoche',
            phone: '054-445566',
            description: 'Ropa y accesorios',
            mapsUrl: 'https://www.google.com/maps/search/Triathlon+Sport+Arequipa'
        },
        {
            id: 3,
            name: 'Adidas Store',
            address: 'Mall Plaza Cayma',
            phone: '054-223344',
            description: 'Tienda de marca',
            mapsUrl: 'https://www.google.com/maps/search/Adidas+Store+Arequipa'
        },
        {
            id: 4,
            name: 'Nike Store',
            address: 'Real Plaza Arequipa',
            phone: '054-667788',
            description: 'Tienda de marca',
            mapsUrl: 'https://www.google.com/maps/search/Nike+Store+Arequipa'
        },
        {
            id: 5,
            name: 'Polvos Azules (Arequipa)',
            address: 'Calle San Juan de Dios',
            phone: 'Varias tiendas',
            description: 'Galería comercial deportiva',
            mapsUrl: 'https://www.google.com/maps/search/Polvos+Azules+Arequipa'
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
                            <p>{deporte.items?.nombre}</p>
                            {deporte.deporte_marcas?.nombre && <span className="modal-marca">Marca: {deporte.deporte_marcas.nombre}</span>}
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
                                <p>Contacta directamente con tiendas deportivas verificadas</p>
                            </div>
                            {loadingVendors ? (
                                <div className="loading-vendors">
                                    <p>Cargando tiendas...</p>
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
                                                    ⚽ {vendor.stats.totalRecipes} productos
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
                                    <p>Aún no hay tiendas deportivas registradas en esta categoría.</p>
                                    <p>¿Eres vendedor? ¡Regístrate y aparece aquí!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'online' && (
                        <div className="purchase-section">
                            <div className="purchase-section-header">
                                <h3>Tiendas en Línea</h3>
                                <p>Compra equipamiento deportivo con envío a domicilio</p>
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
                                            Ver Tienda
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
                                <p>Visita una tienda deportiva cerca de ti</p>
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

export default DeportePurchaseOptions;
