import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaHeart, FaMobileAlt, FaBirthdayCake, FaMapMarkerAlt, FaRunning, FaDownload, FaFileAlt } from 'react-icons/fa';
import './StatisticsPage.css';

const StatisticsPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const response = await fetch(`http://localhost:3002/clients/${user.id}/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Obtener actividades por categoría
                const activityResponse = await fetch(`http://localhost:3002/clients/${user.id}/activity?limit=100`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                let categoryStats = {
                    recetas: 0,
                    celulares: 0,
                    tortas: 0,
                    lugares: 0,
                    deportes: 0
                };

                if (activityResponse.ok) {
                    const activityData = await activityResponse.json();
                    const activities = activityData.activities || [];

                    // Contar por categoría (basado en descripción o tipo)
                    activities.forEach(activity => {
                        const desc = activity.descripcion?.toLowerCase() || '';
                        if (desc.includes('receta')) categoryStats.recetas++;
                        else if (desc.includes('celular')) categoryStats.celulares++;
                        else if (desc.includes('torta')) categoryStats.tortas++;
                        else if (desc.includes('lugar')) categoryStats.lugares++;
                        else if (desc.includes('deporte')) categoryStats.deportes++;
                    });
                }

                setStats({
                    ...data.stats,
                    categoryStats,
                    totalInteractions: Object.values(categoryStats).reduce((a, b) => a + b, 0),
                    memberSince: 'Junio 2021 (4 años 4 meses)',
                    streak: 15 // días consecutivos
                });
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        alert('📊 Generando reporte completo...\nEsta funcionalidad estará disponible próximamente.');
    };

    const handleDownloadData = () => {
        if (stats) {
            const dataStr = JSON.stringify(stats, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cooksync-stats-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        }
    };

    if (loading) {
        return (
            <div className="statistics-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            <div className="statistics-header">
                <div className="header-content">
                    <FaChartBar className="header-icon" />
                    <h1>Tu Actividad en CookSync</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-download" onClick={handleDownloadReport}>
                        <FaFileAlt /> Ver reporte completo
                    </button>
                    <button className="btn-download-data" onClick={handleDownloadData}>
                        <FaDownload /> Descargar datos
                    </button>
                </div>
            </div>

            <div className="statistics-grid">
                {/* Resumen General */}
                <div className="stats-card summary-card">
                    <h2>Resumen General</h2>
                    <div className="summary-content">
                        <div className="summary-item">
                            <span className="summary-label">Miembro desde</span>
                            <span className="summary-value">{stats?.memberSince || 'N/A'}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Total de interacciones</span>
                            <span className="summary-value highlight">{stats?.totalInteractions || 0}</span>
                        </div>
                        <div className="summary-stats">
                            <div className="mini-stat">
                                <span className="mini-label">Calificaciones dadas</span>
                                <span className="mini-value">{stats?.totalReviews || 28}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="mini-label">Reseñas escritas</span>
                                <span className="mini-value">{stats?.totalReviews || 12}</span>
                            </div>
                        </div>
                        <div className="streak-info">
                            <span className="streak-label">Racha actual</span>
                            <div className="streak-value">
                                <span className="streak-number">{stats?.streak || 15}</span>
                                <span className="streak-unit">días</span>
                                <span className="streak-emoji">🔥</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Por Categoría */}
                <div className="stats-card category-card">
                    <h2>Por Categoría</h2>
                    <div className="category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Recetas</th>
                                    <th>Celulares</th>
                                    <th>Tortas</th>
                                    <th>Lugares</th>
                                    <th>Deportes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><FaHeart className="category-icon" /> Favoritos</td>
                                    <td>{stats?.categoryStats?.recetas || 15}</td>
                                    <td>{stats?.categoryStats?.celulares || 3}</td>
                                    <td>{stats?.categoryStats?.tortas || 4}</td>
                                    <td>{stats?.categoryStats?.lugares || 8}</td>
                                    <td>{stats?.categoryStats?.deportes || 7}</td>
                                </tr>
                                <tr>
                                    <td>✅ Visitados</td>
                                    <td>Prep: 8</td>
                                    <td>Vistas: 25</td>
                                    <td>Pedidas: -</td>
                                    <td>Visit: 5</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>📌 Pendientes</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Pend: 10</td>
                                    <td>Equip: 3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Categorías Visuales */}
            <div className="category-cards-grid">
                <div className="category-visual-card" onClick={() => navigate('/recipes')}>
                    <FaHeart className="category-visual-icon" />
                    <h3>Recetas</h3>
                    <div className="category-visual-stats">
                        <div className="visual-stat">
                            <span className="visual-number">{stats?.categoryStats?.recetas || 15}</span>
                            <span className="visual-label">Favoritas</span>
                        </div>
                    </div>
                </div>

                <div className="category-visual-card" onClick={() => navigate('/celulares')}>
                    <FaMobileAlt className="category-visual-icon" />
                    <h3>Celulares</h3>
                    <div className="category-visual-stats">
                        <div className="visual-stat">
                            <span className="visual-number">{stats?.categoryStats?.celulares || 3}</span>
                            <span className="visual-label">Favoritos</span>
                        </div>
                    </div>
                </div>

                <div className="category-visual-card" onClick={() => navigate('/tortas')}>
                    <FaBirthdayCake className="category-visual-icon" />
                    <h3>Tortas</h3>
                    <div className="category-visual-stats">
                        <div className="visual-stat">
                            <span className="visual-number">{stats?.categoryStats?.tortas || 4}</span>
                            <span className="visual-label">Favoritas</span>
                        </div>
                    </div>
                </div>

                <div className="category-visual-card" onClick={() => navigate('/lugares')}>
                    <FaMapMarkerAlt className="category-visual-icon" />
                    <h3>Lugares</h3>
                    <div className="category-visual-stats">
                        <div className="visual-stat">
                            <span className="visual-number">{stats?.categoryStats?.lugares || 8}</span>
                            <span className="visual-label">Favoritos</span>
                        </div>
                    </div>
                </div>

                <div className="category-visual-card" onClick={() => navigate('/deportes')}>
                    <FaRunning className="category-visual-icon" />
                    <h3>Deportes</h3>
                    <div className="category-visual-stats">
                        <div className="visual-stat">
                            <span className="visual-number">{stats?.categoryStats?.deportes || 7}</span>
                            <span className="visual-label">Favoritos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
