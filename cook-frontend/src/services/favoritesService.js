/**
 * Servicio para manejar las operaciones de favoritas
 */
class FavoritesService {
  constructor() {
    this.baseURL = 'http://localhost:3002/recipes';
  }

  /**
   * Obtener headers con autenticación
   */
  getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Agregar receta a favoritas
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async addToFavorites(recipeId) {
    try {
      const response = await fetch(`${this.baseURL}/${recipeId}/favorite`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Receta agregada a favoritas:', data);
      return data;
    } catch (error) {
      console.error('Error agregando a favoritas:', error);
      throw error;
    }
  }

  /**
   * Quitar receta de favoritas
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeFromFavorites(recipeId) {
    try {
      const response = await fetch(`${this.baseURL}/${recipeId}/favorite`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Receta quitada de favoritas:', data);
      return data;
    } catch (error) {
      console.error('Error quitando de favoritas:', error);
      throw error;
    }
  }

  /**
   * Alternar estado de favorita (agregar o quitar)
   * @param {number} recipeId - ID de la receta
   * @param {boolean} isFavorite - Estado actual de favorita
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async toggleFavorite(recipeId, isFavorite) {
    if (isFavorite) {
      return await this.removeFromFavorites(recipeId);
    } else {
      return await this.addToFavorites(recipeId);
    }
  }

  /**
   * Obtener todas las recetas favoritas del usuario
   * @returns {Promise<Object>} Lista de recetas favoritas
   */
  async getMyFavorites() {
    try {
      const response = await fetch(`${this.baseURL}/favorites/my`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Favoritas obtenidas:', data);
      return data;
    } catch (error) {
      console.error('Error obteniendo favoritas:', error);
      throw error;
    }
  }

  /**
   * Verificar si una receta es favorita
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<boolean>} True si es favorita, false si no
   */
  async isFavorite(recipeId) {
    try {
      const response = await fetch(`${this.baseURL}/${recipeId}/is-favorite`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.isFavorite;
    } catch (error) {
      console.error('Error verificando favorita:', error);
      return false; // En caso de error, asumir que no es favorita
    }
  }

  /**
   * Verificar múltiples recetas si son favoritas
   * @param {number[]} recipeIds - Array de IDs de recetas
   * @returns {Promise<Object>} Objeto con recipeId como key y boolean como value
   */
  async checkMultipleFavorites(recipeIds) {
    try {
      const promises = recipeIds.map(id => 
        this.isFavorite(id).then(isFav => ({ id, isFavorite: isFav }))
      );
      
      const results = await Promise.all(promises);
      
      // Convertir array a objeto para fácil acceso
      const favoritesMap = {};
      results.forEach(({ id, isFavorite }) => {
        favoritesMap[id] = isFavorite;
      });
      
      return favoritesMap;
    } catch (error) {
      console.error('Error verificando múltiples favoritas:', error);
      return {};
    }
  }

  /**
   * Obtener estadísticas de favoritas del usuario
   * @returns {Promise<Object>} Estadísticas de favoritas
   */
  async getFavoritesStats() {
    try {
      const favorites = await this.getMyFavorites();
      const total = favorites.total || 0;
      
      // Calcular estadísticas básicas
      const stats = {
        total,
        categories: {},
        difficulties: {},
        recentCount: 0, // Favoritas agregadas en los últimos 7 días
      };

      if (favorites.recipes && favorites.recipes.length > 0) {
        favorites.recipes.forEach(recipe => {
          // Contar por categorías
          const categoryName = recipe.categoria?.nombre || 'Sin categoría';
          stats.categories[categoryName] = (stats.categories[categoryName] || 0) + 1;
          
          // Contar por dificultades
          const difficultyName = recipe.dificultad?.nivel || 'Sin dificultad';
          stats.difficulties[difficultyName] = (stats.difficulties[difficultyName] || 0) + 1;
        });
      }

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de favoritas:', error);
      return {
        total: 0,
        categories: {},
        difficulties: {},
        recentCount: 0,
      };
    }
  }
}

// Crear y exportar una instancia única del servicio
const favoritesServiceInstance = new FavoritesService();
export default favoritesServiceInstance;
