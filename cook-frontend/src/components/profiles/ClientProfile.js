import React, { useState, useEffect } from 'react';
import ProfileEdit from '../profile/ProfileEdit';
import PantryManager from '../pantry/PantryManager';
import './ProfileStyles.css';

const ClientProfile = ({ user }) => {
  const [clientData, setClientData] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPantryManager, setShowPantryManager] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    // Cargar datos específicos del cliente
    loadClientData();
    loadFavoriteRecipes();
    loadPantryItems();
    loadRecentActivity();
  }, [user.id]);

  const loadClientData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3002/clients/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClientData(data.user);
      } else {
        console.error('Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
    }
  };

  const loadFavoriteRecipes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3002/clients/${user.id}/favorite-recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavoriteRecipes(data.recipes || []);
      } else {
        setFavoriteRecipes([]);
      }
    } catch (error) {
      console.error('Error cargando recetas favoritas:', error);
      setFavoriteRecipes([]);
    }
  };

  const loadPantryItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3002/clients/${user.id}/pantry`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPantryItems(data.items || []);
      } else {
        setPantryItems([]);
      }
    } catch (error) {
      console.error('Error cargando despensa:', error);
      setPantryItems([]);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3002/clients/${user.id}/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
      } else {
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error cargando actividad reciente:', error);
      setRecentActivity([]);
    }
  };

  return (
    <div className="profile-container client-profile">
      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.fotoPerfil || '/default-avatar.png'} 
            alt="Avatar"
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h1>¡Hola, {currentUser.nombres}! 👋</h1>
          <p className="profile-subtitle">Bienvenido a tu cocina personal</p>
          <div className="client-stats">
            <div className="stat-item">
              <span className="stat-number">{clientData?.puntosFidelidad || 0}</span>
              <span className="stat-label">Puntos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{favoriteRecipes?.length || 0}</span>
              <span className="stat-label">Favoritas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{pantryItems?.length || 0}</span>
              <span className="stat-label">Ingredientes</span>
            </div>
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => setShowEditProfile(true)}
          >
            ✏️ Editar Perfil
          </button>
        </div>
      </div>

      {/* Dashboard principal */}
      <div className="dashboard-grid">
        {/* Plan actual */}
        <div className="dashboard-card plan-card">
          <h3>🎯 Tu Plan Actual</h3>
          <div className="plan-info">
            <span className="plan-name">{clientData?.plan?.nombre || 'Plan Básico'}</span>
            <span className="plan-level">{clientData?.nivelCliente || 'BRONCE'}</span>
          </div>
          <div className="plan-benefits">
            <p>✨ {clientData?.plan?.limiteRecetasFavoritas || 10} recetas favoritas</p>
            <p>🥕 {clientData?.plan?.limiteIngredientes || 50} ingredientes en despensa</p>
          </div>
          <button className="upgrade-btn">Mejorar Plan</button>
        </div>

        {/* Recetas favoritas */}
        <div className="dashboard-card favorites-card">
          <h3>❤️ Recetas Favoritas</h3>
          <div className="favorites-list">
            {(favoriteRecipes || []).length > 0 ? (
              (favoriteRecipes || []).slice(0, 3).map(recipe => (
                <div key={recipe.id} className="favorite-item">
                  <img src={recipe.imagenPrincipal} alt={recipe.nombre} />
                  <div className="favorite-info">
                    <h4>{recipe.nombre}</h4>
                    <p>{recipe.tiempoPreparacion} min • {recipe.dificultad}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Aún no tienes recetas favoritas</p>
            )}
          </div>
          <button className="view-all-btn">Ver todas las favoritas</button>
        </div>

        {/* Mi despensa */}
        <div className="dashboard-card pantry-card">
          <h3>🥫 Mi Despensa</h3>
          <div className="pantry-summary">
            <p>Tienes <strong>{pantryItems?.length || 0}</strong> ingredientes</p>
            <div className="pantry-categories">
              {(pantryItems || []).slice(0, 5).map(item => (
                <span key={item.id} className="pantry-tag">
                  {item.ingrediente?.nombre || item.nombre || 'Ingrediente'}
                </span>
              ))}
            </div>
          </div>
          <button className="manage-pantry-btn">Gestionar Despensa</button>
        </div>

        {/* Recomendaciones */}
        <div className="dashboard-card recommendations-card">
          <h3>🍽️ Recomendado para ti</h3>
          <div className="recommendations">
            <div className="recommendation-item">
              <h4>Recetas con tus ingredientes</h4>
              <p>Encontramos 12 recetas que puedes hacer ahora</p>
              <button className="recommendation-btn">Ver recetas</button>
            </div>
            <div className="recommendation-item">
              <h4>Ingredientes por comprar</h4>
              <p>Te faltan 3 ingredientes para completar recetas</p>
              <button className="recommendation-btn">Ver lista</button>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="dashboard-card activity-card">
          <h3>📈 Actividad Reciente</h3>
          <div className="activity-list">
            {(recentActivity || []).length > 0 ? (
              (recentActivity || []).slice(0, 5).map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-text">
                    <p>{activity.description}</p>
                    <small>{activity.timestamp}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No hay actividad reciente</p>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="dashboard-card quick-actions-card">
          <h3>⚡ Acciones Rápidas</h3>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span className="action-icon">🔍</span>
              Buscar Recetas
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setShowPantryManager(true)}
            >
              <span className="action-icon">🥫</span>
              Mi Despensa
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">🎯</span>
              Planificar Menú
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">⭐</span>
              Calificar Recetas
            </button>
          </div>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditProfile && (
        <ProfileEdit
          user={currentUser}
          onClose={() => setShowEditProfile(false)}
          onUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
            setShowEditProfile(false);
          }}
        />
      )}

      {/* Modal de gestión de despensa */}
      {showPantryManager && (
        <PantryManager
          user={currentUser}
          onClose={() => setShowPantryManager(false)}
        />
      )}
    </div>
  );
};

export default ClientProfile;
