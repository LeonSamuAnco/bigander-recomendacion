const API_URL = 'http://localhost:3002';

class AdminService {
  // Obtener token de autenticación
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Headers con autenticación
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Probar conexión con admin
  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/admin/test`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con admin module');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en testConnection:', error);
      throw error;
    }
  }

  // Obtener estadísticas del sistema
  async getSystemStats() {
    try {
      console.log('Frontend: Calling admin stats endpoint');
      
      // Primero probar endpoint sin autenticación
      try {
        const testResponse = await fetch(`${API_URL}/admin/test-stats`);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Frontend: Test stats data received:', testData);
          if (testData.success) {
            return testData.stats;
          }
        }
      } catch (testError) {
        console.log('Frontend: Test endpoint failed, trying authenticated endpoint');
      }
      
      // Si el test falla, usar endpoint con autenticación
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: this.getAuthHeaders(),
      });

      console.log('Frontend: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Frontend: Error response:', errorText);
        throw new Error(`Error al obtener estadísticas del sistema: ${response.status}`);
      }

      const data = await response.json();
      console.log('Frontend: Stats data received:', data);
      return data;
    } catch (error) {
      console.error('Error en getSystemStats:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios con paginación
  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  // Obtener usuarios recientes
  async getRecentUsers(limit = 5) {
    try {
      console.log('Frontend: Calling recent users endpoint');
      
      // Primero probar endpoint sin autenticación
      try {
        const testResponse = await fetch(`${API_URL}/admin/test-recent-users`);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Frontend: Test recent users data received:', testData);
          if (testData.success) {
            return testData.users;
          }
        }
      } catch (testError) {
        console.log('Frontend: Test recent users endpoint failed, trying authenticated endpoint');
      }
      
      // Si el test falla, usar endpoint con autenticación
      const response = await fetch(`${API_URL}/admin/users/recent?limit=${limit}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios recientes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getRecentUsers:', error);
      throw error;
    }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(userId) {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en toggleUserStatus:', error);
      throw error;
    }
  }

  // Obtener roles del sistema
  async getSystemRoles() {
    try {
      const response = await fetch(`${API_URL}/admin/roles`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener roles del sistema');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getSystemRoles:', error);
      throw error;
    }
  }

  // Cambiar rol de usuario
  async changeUserRole(userId, newRoleId) {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar rol del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en changeUserRole:', error);
      throw error;
    }
  }

  // Obtener reportes del sistema
  async getSystemReports() {
    try {
      const response = await fetch(`${API_URL}/admin/reports`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener reportes del sistema');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getSystemReports:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS PARA GESTIÓN DE RECETAS
  // ========================================

  // Obtener todas las recetas para administración
  async getAllRecipes(page = 1, limit = 10, search = '') {
    try {
      console.log('Frontend: Calling admin recipes endpoint');
      
      // Primero probar endpoint sin autenticación
      try {
        const testResponse = await fetch(`${API_URL}/admin/test-recipes`);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Frontend: Test recipes data received:', testData);
          if (testData.success) {
            return testData;
          }
        }
      } catch (testError) {
        console.log('Frontend: Test recipes endpoint failed, trying authenticated endpoint');
      }
      
      // Si el test falla, usar endpoint con autenticación
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
      const response = await fetch(`${API_URL}/admin/recipes?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener recetas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAllRecipes:', error);
      throw error;
    }
  }

  // Obtener estadísticas de recetas
  async getRecipesStats() {
    try {
      const response = await fetch(`${API_URL}/admin/recipes/stats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas de recetas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getRecipesStats:', error);
      // Retornar datos por defecto
      return {
        totalRecipes: 0,
        activeRecipes: 0,
        inactiveRecipes: 0,
        averageRating: 0,
        totalViews: 0,
        recentRecipes: 0,
      };
    }
  }

  // Activar/Desactivar receta
  async toggleRecipeStatus(recipeId) {
    try {
      const response = await fetch(`${API_URL}/admin/recipes/${recipeId}/toggle-status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado de la receta');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en toggleRecipeStatus:', error);
      throw error;
    }
  }
}

export default new AdminService();
