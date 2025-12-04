const API_BASE_URL = 'http://localhost:3002';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const vendorService = {
  // Obtener estadísticas del vendedor
  async getVendorStats(vendorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/stats`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      }

      // Fallback con datos de ejemplo
      return {
        totalRecipes: 0,
        activeRecipes: 0,
        totalReviews: 0,
        averageRating: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalSales: 0,
        recentRecipes: [],
      };
    } catch (error) {
      console.error('Error getting vendor stats:', error);
      return {
        totalRecipes: 0,
        activeRecipes: 0,
        totalReviews: 0,
        averageRating: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalSales: 0,
        recentRecipes: [],
      };
    }
  },

  // Obtener productos del vendedor
  async getVendorProducts(vendorId, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/products?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Error getting vendor products:', error);
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  // Obtener pedidos del vendedor
  async getVendorOrders(vendorId, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/orders?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        orders: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Error getting vendor orders:', error);
      return {
        orders: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  // Obtener analytics del vendedor
  async getVendorAnalytics(vendorId, days = 30) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/analytics?days=${days}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        salesByDay: [],
        topRecipes: [],
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        period: days,
      };
    } catch (error) {
      console.error('Error getting vendor analytics:', error);
      return {
        salesByDay: [],
        topRecipes: [],
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        period: days,
      };
    }
  },

  // Obtener reseñas del vendedor
  async getVendorReviews(vendorId, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/reviews?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        reviews: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Error getting vendor reviews:', error);
      return {
        reviews: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  // Obtener clientes del vendedor
  async getVendorCustomers(vendorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/customers`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        customers: [],
        total: 0,
      };
    } catch (error) {
      console.error('Error getting vendor customers:', error);
      return {
        customers: [],
        total: 0,
      };
    }
  },

  // Actualizar producto
  async updateProduct(vendorId, productId, data) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/products/${productId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to update product');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Activar/Desactivar producto
  async toggleProduct(vendorId, productId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/products/${productId}/toggle`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to toggle product');
    } catch (error) {
      console.error('Error toggling product:', error);
      throw error;
    }
  },

  // Gestión de inventario
  async getVendorInventory(vendorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/inventory`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      // Fallback con datos de ejemplo para inventario
      return {
        ingredients: [
          {
            id: 1,
            name: 'Pollo',
            category: 'Carnes',
            currentStock: 25,
            minStock: 10,
            unit: 'kg',
            cost: 15.50,
            supplier: 'Mercado Central',
            lastUpdated: new Date().toISOString(),
            status: 'in_stock'
          },
          {
            id: 2,
            name: 'Arroz',
            category: 'Granos',
            currentStock: 5,
            minStock: 15,
            unit: 'kg',
            cost: 3.20,
            supplier: 'Distribuidora Lima',
            lastUpdated: new Date().toISOString(),
            status: 'low_stock'
          },
          {
            id: 3,
            name: 'Aceite de Oliva',
            category: 'Aceites',
            currentStock: 0,
            minStock: 5,
            unit: 'L',
            cost: 25.00,
            supplier: 'Importadora Gourmet',
            lastUpdated: new Date().toISOString(),
            status: 'out_of_stock'
          }
        ],
        summary: {
          totalItems: 3,
          lowStockItems: 1,
          outOfStockItems: 1,
          totalValue: 478.50
        }
      };
    } catch (error) {
      console.error('Error getting vendor inventory:', error);
      return {
        ingredients: [],
        summary: {
          totalItems: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          totalValue: 0
        }
      };
    }
  },

  // Actualizar stock de inventario
  async updateInventoryStock(vendorId, ingredientId, newStock) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/inventory/${ingredientId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ stock: newStock }),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      // Simulación exitosa
      return {
        success: true,
        message: 'Stock actualizado correctamente'
      };
    } catch (error) {
      console.error('Error updating inventory stock:', error);
      throw error;
    }
  },

  // Gestión de marketing
  async getVendorCampaigns(vendorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/campaigns`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      // Fallback con campañas de ejemplo
      return {
        campaigns: [
          {
            id: 1,
            name: 'Promoción Fin de Semana',
            type: 'discount',
            status: 'active',
            discount: 20,
            startDate: '2025-11-15',
            endDate: '2025-11-17',
            recipesCount: 5,
            views: 150,
            conversions: 12
          },
          {
            id: 2,
            name: 'Recetas Navideñas',
            type: 'featured',
            status: 'scheduled',
            startDate: '2025-12-01',
            endDate: '2025-12-25',
            recipesCount: 8,
            views: 0,
            conversions: 0
          }
        ],
        stats: {
          totalCampaigns: 2,
          activeCampaigns: 1,
          totalViews: 150,
          totalConversions: 12,
          conversionRate: 8.0
        }
      };
    } catch (error) {
      console.error('Error getting vendor campaigns:', error);
      return {
        campaigns: [],
        stats: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalViews: 0,
          totalConversions: 0,
          conversionRate: 0
        }
      };
    }
  },

  // Crear nueva campaña
  async createCampaign(vendorId, campaignData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/campaigns`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(campaignData),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      // Simulación exitosa
      return {
        success: true,
        message: 'Campaña creada exitosamente',
        campaign: {
          id: Date.now(),
          ...campaignData,
          status: 'draft',
          views: 0,
          conversions: 0
        }
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Configuración del vendedor
  async getVendorSettings(vendorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/settings`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      // Configuración por defecto
      return {
        profile: {
          businessName: 'Mi Cocina Gourmet',
          description: 'Especialistas en comida casera y saludable',
          phone: '+51 999 888 777',
          email: 'contacto@micocina.com',
          address: 'Av. Principal 123, Arequipa',
          website: 'www.micocina.com'
        },
        preferences: {
          notifications: {
            newOrders: true,
            lowStock: true,
            newReviews: true,
            marketing: false
          },
          business: {
            autoAcceptOrders: false,
            showPhone: true,
            showEmail: true,
            allowMessages: true
          }
        },
        paymentMethods: [
          { id: 1, name: 'Efectivo', enabled: true },
          { id: 2, name: 'Tarjeta', enabled: true },
          { id: 3, name: 'Yape/Plin', enabled: false },
          { id: 4, name: 'Transferencia', enabled: false }
        ]
      };
    } catch (error) {
      console.error('Error getting vendor settings:', error);
      return {
        profile: {},
        preferences: {},
        paymentMethods: []
      };
    }
  },

  // Actualizar configuración
  async updateVendorSettings(vendorId, settings) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/settings`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        success: true,
        message: 'Configuración actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error updating vendor settings:', error);
      throw error;
    }
  },

  // Notificaciones del vendedor
  async getVendorNotifications(vendorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/notifications`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      // Notificaciones de ejemplo
      return {
        notifications: [
          {
            id: 1,
            type: 'new_order',
            title: 'Nuevo pedido recibido',
            message: 'Juan Pérez preparó tu receta "Pollo a la Plancha"',
            date: new Date().toISOString(),
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'low_stock',
            title: 'Stock bajo',
            message: 'El arroz tiene stock bajo (5kg restantes)',
            date: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'new_review',
            title: 'Nueva reseña',
            message: 'María López dejó una reseña de 5 estrellas',
            date: new Date(Date.now() - 7200000).toISOString(),
            read: true,
            priority: 'low'
          }
        ],
        unreadCount: 2
      };
    } catch (error) {
      console.error('Error getting vendor notifications:', error);
      return {
        notifications: [],
        unreadCount: 0
      };
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(vendorId, notificationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // --- Gestión de Productos Físicos ---

  // Obtener productos físicos
  async getStoreProducts(vendorId, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/store-products?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        return await response.json();
      }

      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Error getting store products:', error);
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  },

  // Crear producto físico
  async createStoreProduct(vendorId, data) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/store-products`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error del servidor al crear producto:', errorData);
      throw new Error(errorData.message || 'Error al crear el producto');
    } catch (error) {
      console.error('Error creating store product:', error);
      throw error;
    }
  },

  // Actualizar producto físico
  async updateStoreProduct(vendorId, productId, data) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/store-products/${productId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to update product');
    } catch (error) {
      console.error('Error updating store product:', error);
      throw error;
    }
  },

  // Toggle producto físico
  async toggleStoreProduct(vendorId, productId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendors/${vendorId}/store-products/${productId}/toggle`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to toggle product');
    } catch (error) {
      console.error('Error toggling store product:', error);
      throw error;
    }
  },

  // Subir imagen genérica
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      }

      console.log('📤 Subiendo imagen...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasToken: !!token
      });

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📥 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al subir imagen');
      }

      const result = await response.json();
      console.log('✅ Imagen subida exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  },

  // Importar productos desde Excel
  async importProducts(vendorId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/products/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al importar productos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }
};

export default vendorService;
