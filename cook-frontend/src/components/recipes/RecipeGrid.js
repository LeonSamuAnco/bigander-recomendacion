import React from 'react';
import recipeService from '../../services/recipeService';
import './RecipeGrid.css';

const RecipeCard = ({ recipe, onClick }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': '#10b981',
      'Medio': '#f59e0b',
      'Difícil': '#ef4444',
      'Experto': '#8b5cf6'
    };
    return colors[difficulty?.nivel || difficulty] || '#6b7280';
  };

  const getCategoryEmoji = (categoryName) => {
    return recipeService.getCategoryEmoji(categoryName);
  };

  return (
    <div className="recipe-card" onClick={() => onClick?.(recipe)}>
      {/* Imagen de la receta */}
      <div className="recipe-image">
        {recipe.imagenPrincipal ? (
          <img 
            src={recipe.imagenPrincipal} 
            alt={recipe.nombre}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="recipe-image-placeholder" style={{display: recipe.imagenPrincipal ? 'none' : 'flex'}}>
          <span className="placeholder-icon">🍽️</span>
        </div>
        
        {/* Badge de coincidencia (si existe) */}
        {recipe.matchPercentage && (
          <div className="match-badge">
            {recipe.matchPercentage}% coincidencia
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="recipe-content">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipe.nombre}</h3>
          <div className="recipe-category">
            {getCategoryEmoji(recipe.categoria?.nombre)} {recipe.categoria?.nombre}
          </div>
        </div>

        <p className="recipe-description">
          {recipe.descripcion || 'Deliciosa receta para disfrutar en cualquier momento.'}
        </p>

        {/* Información rápida */}
        <div className="recipe-info">
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span>{recipeService.formatTime(recipe.tiempoTotal)}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">👥</span>
            <span>{recipe.porciones} porciones</span>
          </div>
          <div 
            className="info-item difficulty" 
            style={{ color: getDifficultyColor(recipe.dificultad) }}
          >
            <span className="info-icon">📊</span>
            <span>{recipe.dificultad?.nivel || 'Medio'}</span>
          </div>
        </div>

        {/* Ingredientes principales */}
        {recipe.ingredientes && recipe.ingredientes.length > 0 && (
          <div className="recipe-ingredients">
            <div className="ingredients-preview">
              {recipe.ingredientes.slice(0, 3).map((ing, index) => (
                <span key={index} className="ingredient-chip">
                  {ing.ingredienteMaestro?.nombre || ing.nombre}
                </span>
              ))}
              {recipe.ingredientes.length > 3 && (
                <span className="more-ingredients">
                  +{recipe.ingredientes.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Badges dietéticos */}
        <div className="recipe-badges">
          {recipe.esVegetariana && <span className="badge vegetarian">🥬 Vegetariana</span>}
          {recipe.esVegana && <span className="badge vegan">🌱 Vegana</span>}
          {recipe.sinGluten && <span className="badge gluten-free">🚫 Sin gluten</span>}
          {recipe.sinLactosa && <span className="badge lactose-free">🥛 Sin lactosa</span>}
          {recipe.esSaludable && <span className="badge healthy">💚 Saludable</span>}
        </div>

        {/* Información adicional si es búsqueda por ingredientes */}
        {recipe.matchingIngredients && (
          <div className="match-info">
            <span className="match-text">
              {recipe.matchingIngredients} de {recipe.totalIngredients} ingredientes disponibles
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const RecipeGrid = ({ recipes, loading, onRecipeClick, emptyMessage }) => {
  if (loading) {
    return (
      <div className="recipe-grid-loading">
        <div className="loading-spinner">🔄</div>
        <p>Buscando recetas deliciosas...</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-grid-empty">
        <div className="empty-icon">🔍</div>
        <h3>No se encontraron recetas</h3>
        <p>{emptyMessage || 'Intenta ajustar tus filtros de búsqueda o agregar diferentes ingredientes.'}</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid-header">
        <h2>🍽️ Recetas encontradas ({recipes.length})</h2>
        {recipes.some(r => r.matchPercentage) && (
          <p className="search-note">Ordenadas por coincidencia de ingredientes</p>
        )}
      </div>
      
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <RecipeCard 
            key={recipe.id || index} 
            recipe={recipe} 
            onClick={onRecipeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
