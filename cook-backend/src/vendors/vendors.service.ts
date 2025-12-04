import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private prisma: PrismaService,
  ) { }

  // Obtener estadísticas del vendedor
  async getVendorStats(vendorId: number) {
    try {
      // Obtener recetas del vendedor
      const recipes = await this.prisma.recipe.findMany({
        where: {
          autorId: vendorId,
          esActivo: true,
        },
      });

      // Obtener reseñas de las recetas del vendedor
      const recipeIds = recipes.map(r => r.id);
      const reviews = recipeIds.length > 0 ? await this.prisma.recipeReview.findMany({
        where: {
          recetaId: { in: recipeIds },
          esActivo: true,
        },
      }) : [];

      // Calcular estadísticas
      const totalRecipes = recipes.length;
      const totalReviews = reviews.length;
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length
        : 0;

      const totalViews = recipes.reduce((acc, r) => acc + (r.vecesPreparada || 0), 0);
      const totalFavorites = recipes.reduce((acc, r) => acc + (r.vecesFavorita || 0), 0);

      return {
        totalRecipes,
        activeRecipes: recipes.filter(r => r.esActivo).length,
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalViews,
        totalFavorites,
        totalSales: totalViews * 5, // Estimación de ventas
        recentRecipes: recipes.slice(0, 5).map(r => ({
          id: r.id,
          name: r.nombre,
          price: r.costoAproximado || 0,
          vistas: r.vecesPreparada,
          createdAt: r.createdAt,
        })),
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
  }

  // Obtener productos/recetas del vendedor
  async getVendorProducts(vendorId: number, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [recipes, total] = await Promise.all([
        this.prisma.recipe.findMany({
          where: {
            autorId: vendorId,
            esActivo: true,
          },
          include: {
            categoria: true,
            dificultad: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.recipe.count({
          where: {
            autorId: vendorId,
            esActivo: true,
          },
        }),
      ]);

      return {
        products: recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.nombre,
          description: recipe.descripcion,
          price: recipe.costoAproximado || 0,
          image: recipe.imagenPrincipal,
          status: recipe.esActivo ? 'active' : 'inactive',
          category: recipe.categoria?.nombre || 'General',
          rating: recipe.calificacionPromedio || 0,
          views: recipe.vecesPreparada || 0,
          createdAt: recipe.createdAt,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
  }

  // Obtener pedidos del vendedor (basado en recetas preparadas)
  async getVendorOrders(vendorId: number, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      // Obtener recetas del vendedor
      const recipes = await this.prisma.recipe.findMany({
        where: {
          autorId: vendorId,
          esActivo: true,
        },
        select: {
          id: true,
          nombre: true,
        },
      });

      const recipeIds = recipes.map(r => r.id);

      // Obtener actividades de preparación como "pedidos"
      const activities = recipeIds.length > 0 ? await this.prisma.userActivity.findMany({
        where: {
          tipo: 'RECETA_PREPARADA',
          referenciaId: { in: recipeIds },
          esActivo: true,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          fecha: 'desc',
        },
      }) : [];

      const total = recipeIds.length > 0 ? await this.prisma.userActivity.count({
        where: {
          tipo: 'RECETA_PREPARADA',
          referenciaId: { in: recipeIds },
          esActivo: true,
        },
      }) : 0;

      const recipeMap = new Map(recipes.map(r => [r.id, r.nombre]));

      return {
        orders: activities.map((activity, index) => ({
          id: activity.id,
          orderNumber: `#${String(total - skip - index).padStart(3, '0')}`,
          customer: `${activity.usuario.nombres} ${activity.usuario.apellidos}`,
          customerEmail: activity.usuario.email,
          recipeName: recipeMap.get(activity.referenciaId ?? 0) || 'Receta desconocida',
          date: activity.fecha,
          status: 'completed',
          amount: 5,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
  }

  // Obtener reseñas de las recetas del vendedor
  async getVendorReviews(vendorId: number, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      // Obtener recetas del vendedor
      const recipes = await this.prisma.recipe.findMany({
        where: {
          autorId: vendorId,
          esActivo: true,
        },
        select: {
          id: true,
          nombre: true,
        },
      });

      const recipeIds = recipes.map(r => r.id);

      const [reviews, total] = recipeIds.length > 0 ? await Promise.all([
        this.prisma.recipeReview.findMany({
          where: {
            recetaId: { in: recipeIds },
            esActivo: true,
          },
          select: {
            id: true,
            usuarioId: true,
            recetaId: true,
            calificacion: true,
            tituloResena: true,
            comentario: true,
            createdAt: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.recipeReview.count({
          where: {
            recetaId: { in: recipeIds },
            esActivo: true,
          },
        }),
      ]) : [[], 0];

      // Obtener datos adicionales manualmente
      const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
          const usuario = await this.prisma.user.findUnique({
            where: { id: review.usuarioId },
            select: { nombres: true, apellidos: true, fotoPerfil: true },
          });
          const receta = await this.prisma.recipe.findUnique({
            where: { id: review.recetaId },
            select: { nombre: true },
          });
          return {
            id: review.id,
            rating: review.calificacion,
            comment: review.comentario,
            title: review.tituloResena,
            date: review.createdAt,
            userName: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Usuario desconocido',
            userAvatar: usuario?.fotoPerfil,
            recipeName: receta?.nombre || 'Receta desconocida',
            recipeId: review.recetaId,
          };
        })
      );

      return {
        reviews: reviewsWithDetails,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
  }

  // Obtener clientes del vendedor
  async getVendorCustomers(vendorId: number) {
    try {
      // Obtener recetas del vendedor
      const recipes = await this.prisma.recipe.findMany({
        where: {
          autorId: vendorId,
          esActivo: true,
        },
        select: {
          id: true,
        },
      });

      const recipeIds = recipes.map(r => r.id);

      // Obtener usuarios únicos que han preparado recetas
      const activities = recipeIds.length > 0 ? await this.prisma.userActivity.findMany({
        where: {
          tipo: 'RECETA_PREPARADA',
          referenciaId: { in: recipeIds },
          esActivo: true,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
              fotoPerfil: true,
            },
          },
        },
        distinct: ['usuarioId'],
      }) : [];

      // Contar preparaciones por usuario
      const customerCounts = new Map();

      if (recipeIds.length > 0) {
        const allActivities = await this.prisma.userActivity.findMany({
          where: {
            tipo: 'RECETA_PREPARADA',
            referenciaId: { in: recipeIds },
            esActivo: true,
          },
          select: {
            usuarioId: true,
          },
        });

        allActivities.forEach(activity => {
          customerCounts.set(
            activity.usuarioId,
            (customerCounts.get(activity.usuarioId) || 0) + 1
          );
        });
      }

      return {
        customers: activities.map(activity => ({
          id: activity.usuario.id,
          name: `${activity.usuario.nombres} ${activity.usuario.apellidos}`,
          email: activity.usuario.email,
          avatar: activity.usuario.fotoPerfil,
          totalOrders: customerCounts.get(activity.usuario.id) || 0,
          totalSpent: (customerCounts.get(activity.usuario.id) || 0) * 5,
          lastOrderDate: activity.fecha,
        })),
        total: activities.length,
      };
    } catch (error) {
      console.error('Error getting vendor customers:', error);
      return {
        customers: [],
        total: 0,
      };
    }
  }

  // Obtener analytics avanzado
  async getVendorAnalytics(vendorId: number, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Obtener recetas del vendedor
      const recipes = await this.prisma.recipe.findMany({
        where: {
          autorId: vendorId,
          esActivo: true,
        },
      });

      const recipeIds = recipes.map(r => r.id);

      // Obtener actividades del período
      const activities = recipeIds.length > 0 ? await this.prisma.userActivity.findMany({
        where: {
          tipo: 'RECETA_PREPARADA',
          referenciaId: { in: recipeIds },
          fecha: { gte: startDate },
          esActivo: true,
        },
        orderBy: {
          fecha: 'asc',
        },
      }) : [];

      // Agrupar por día
      const dailyData = new Map();
      activities.forEach(activity => {
        const dateKey = activity.fecha.toISOString().split('T')[0];
        dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + 1);
      });

      // Generar serie temporal completa
      const salesByDay: Array<{ date: string; sales: number; revenue: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        salesByDay.push({
          date: dateKey,
          sales: dailyData.get(dateKey) || 0,
          revenue: (dailyData.get(dateKey) || 0) * 5,
        });
      }

      // Top recetas
      const recipeCounts = new Map();
      activities.forEach(activity => {
        recipeCounts.set(
          activity.referenciaId,
          (recipeCounts.get(activity.referenciaId) || 0) + 1
        );
      });

      const topRecipes = Array.from(recipeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([recipeId, count]) => {
          const recipe = recipes.find(r => r.id === recipeId);
          return {
            id: recipeId,
            name: recipe?.nombre || 'Desconocida',
            orders: count,
            revenue: count * 5,
          };
        });

      return {
        salesByDay,
        topRecipes,
        totalRevenue: activities.length * 5,
        totalOrders: activities.length,
        averageOrderValue: 5,
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
  }

  // Actualizar receta del vendedor
  async updateVendorRecipe(vendorId: number, recipeId: number, updateData: any) {
    try {
      // Verificar que la receta pertenece al vendedor
      const recipe = await this.prisma.recipe.findFirst({
        where: {
          id: recipeId,
          autorId: vendorId,
        },
      });

      if (!recipe) {
        throw new NotFoundException('Receta no encontrada o no pertenece a este vendedor');
      }

      // Actualizar receta
      const updated = await this.prisma.recipe.update({
        where: { id: recipeId },
        data: {
          nombre: updateData.name || recipe.nombre,
          descripcion: updateData.description || recipe.descripcion,
          esActivo: updateData.status === 'active',
        },
      });

      return {
        success: true,
        message: 'Receta actualizada exitosamente',
        recipe: updated,
      };
    } catch (error) {
      throw new BadRequestException('Error al actualizar la receta');
    }
  }

  // Desactivar receta del vendedor
  async toggleVendorRecipe(vendorId: number, recipeId: number) {
    try {
      const recipe = await this.prisma.recipe.findFirst({
        where: {
          id: recipeId,
          autorId: vendorId,
        },
      });

      if (!recipe) {
        throw new NotFoundException('Receta no encontrada');
      }

      const updated = await this.prisma.recipe.update({
        where: { id: recipeId },
        data: {
          esActivo: !recipe.esActivo,
        },
      });

      return {
        success: true,
        message: `Receta ${updated.esActivo ? 'activada' : 'desactivada'} exitosamente`,
        recipe: updated,
      };
    } catch (error) {
      throw new BadRequestException('Error al cambiar estado de la receta');
    }
  }

  // Helper: Calcular precio estimado de receta
  private calculateRecipePrice(recipe: any): number {
    // Precio base de S/ 5.00 por receta
    // Podría basarse en ingredientes, dificultad, etc.
    return 5.00;
  }

  // Obtener configuración del vendedor
  async getVendorSettings(userId: number) {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
        include: {
          categorias: {
            include: {
              categoria: true,
            },
          },
        },
      });

      if (!vendor) {
        // Si no existe perfil de vendedor, devolver configuración por defecto
        return {
          profile: {
            businessName: 'Mi Negocio',
            description: '',
            phone: '',
            email: '',
            address: '',
            website: '',
            categories: [],
          },
          preferences: {},
          paymentMethods: [],
        };
      }

      return {
        profile: {
          businessName: vendor.nombreTienda,
          description: vendor.descripcion,
          phone: '', // Se podría obtener del usuario si se desea
          email: '', // Se podría obtener del usuario
          address: vendor.direccion,
          website: vendor.sitioWeb,
          categories: vendor.categorias.map(vc => vc.categoria.nombre),
        },
        preferences: {
          notifications: {
            newOrders: true,
            lowStock: true,
            newReviews: true,
            marketing: false
          },
        },
        paymentMethods: [
          { id: 1, name: 'Efectivo', enabled: true },
          { id: 2, name: 'Tarjeta', enabled: true },
        ]
      };
    } catch (error) {
      console.error('Error getting vendor settings:', error);
      throw new BadRequestException('Error al obtener configuración');
    }
  }

  // Obtener vendedores por categoría
  async getVendorsByCategory(categoryId: number, limit: number = 10) {
    try {
      const vendors = await this.prisma.vendorCategory.findMany({
        where: {
          categoriaId: categoryId,
          vendedor: {
            usuario: {
              esActivo: true, // Solo mostrar vendedores con usuarios activos
            },
          },
        },
        take: limit,
        include: {
          vendedor: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  email: true,
                  telefono: true,
                  direccion: true,
                  bio: true,
                  fotoPerfil: true,
                  ciudad: true,
                  pais: true,
                  esActivo: true,
                },
              },
            },
          },
          categoria: true,
        },
      });

      // Transformar datos para el frontend
      const vendorsData = await Promise.all(
        vendors.map(async (vc) => {
          const vendor = vc.vendedor;
          const user = vendor.usuario;

          // Obtener estadísticas del vendedor
          const stats = await this.getVendorStats(user.id);

          return {
            id: vendor.id,
            userId: user.id,
            businessName: vendor.nombreTienda || `${user.nombres} ${user.apellidos}`,
            name: `${user.nombres} ${user.apellidos}`,
            email: user.email,
            phone: user.telefono,
            address: vendor.direccion || user.direccion,
            bio: user.bio,
            photo: vendor.logoUrl || user.fotoPerfil, // Priorizar logo del negocio
            city: user.ciudad,
            country: user.pais,
            category: vc.categoria.nombre,
            // Nuevos campos
            latitud: vendor.latitud,
            longitud: vendor.longitud,
            horarioAtencion: vendor.horarioAtencion,
            metodosPago: vendor.metodosPago,
            tipoServicio: vendor.tipoServicio,
            whatsapp: vendor.whatsapp,
            instagram: vendor.instagram,
            facebook: vendor.facebook,
            stats: {
              totalRecipes: stats.totalRecipes,
              averageRating: stats.averageRating,
              totalReviews: stats.totalReviews,
            },
          };
        })
      );

      return {
        vendors: vendorsData,
        total: vendorsData.length,
        category: vendors[0]?.categoria.nombre || 'Desconocida',
      };
    } catch (error) {
      console.error('Error getting vendors by category:', error);
      throw new BadRequestException('Error al obtener vendedores');
    }
  }
  // Obtener productos físicos de la tienda del vendedor
  async getStoreProducts(userId: number, page = 1, limit = 10) {
    try {
      // Obtener ID del vendedor
      const vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
      });

      if (!vendor) {
        return { products: [], total: 0, page, limit, totalPages: 0 };
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            vendedorId: vendor.id,
          },
          include: {
            categoria: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.product.count({
          where: {
            vendedorId: vendor.id,
          },
        }),
      ]);

      return {
        products: products.map(p => ({
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          price: parseFloat(p.precio?.toString() || '0'),
          stock: p.stock,
          image: p.imagenUrl,
          status: p.esActivo ? 'active' : 'inactive',
          category: p.categoria?.nombre || 'General',
          categoryId: p.categoriaId,
          sku: p.sku,
          createdAt: p.createdAt,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting store products:', error);
      return { products: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  // Crear producto de tienda
  async createStoreProduct(userId: number, data: any) {
    try {
      console.log('📦 Creando producto para userId:', userId);
      console.log('📦 Datos recibidos:', JSON.stringify(data, null, 2));

      let vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
      });

      // Si no se encuentra por usuarioId, intentar buscar por id (por si se envió el ID del vendedor)
      if (!vendor) {
        vendor = await this.prisma.vendor.findUnique({
          where: { id: userId },
        });
      }

      if (!vendor) {
        console.error(`❌ Vendedor no encontrado para ID: ${userId}`);
        throw new NotFoundException('Vendedor no encontrado. Asegúrate de tener un perfil de vendedor activo.');
      }

      console.log('✅ Vendedor encontrado:', vendor.id);

      // Validar campos requeridos
      if (!data.name || data.name.trim() === '') {
        throw new BadRequestException('El nombre del producto es requerido');
      }

      if (!data.price || isNaN(parseFloat(data.price))) {
        throw new BadRequestException('El precio del producto es requerido y debe ser un número válido');
      }

      // Verificar o obtener categoría válida
      let categoryId = data.categoryId ? parseInt(data.categoryId) : null;

      // Si se especificó una categoría, verificar que exista
      if (categoryId) {
        const categoryExists = await this.prisma.productCategory.findUnique({
          where: { id: categoryId },
        });
        if (!categoryExists) {
          categoryId = null; // No existe, buscaremos una por defecto
        }
      }

      // Si no hay categoría válida, buscar o crear una por defecto
      if (!categoryId) {
        console.log('⚠️ Buscando categoría por defecto...');

        // Primero buscar si ya existe una categoría "Productos de Tienda"
        let defaultCategory = await this.prisma.productCategory.findFirst({
          where: { nombre: 'Productos de Tienda' },
        });

        // Si no existe, buscar cualquier categoría activa
        if (!defaultCategory) {
          defaultCategory = await this.prisma.productCategory.findFirst({
            where: { esActivo: true },
          });
        }

        // Si no hay ninguna categoría, crear una nueva
        if (!defaultCategory) {
          console.log('📦 Creando categoría por defecto...');
          defaultCategory = await this.prisma.productCategory.create({
            data: {
              nombre: 'Productos de Tienda',
              descripcion: 'Categoría por defecto para productos físicos de vendedores',
              esActivo: true,
            },
          });
        }

        categoryId = defaultCategory.id;
        console.log(`✅ Usando categoría ID: ${categoryId}`);
      }

      // Preparar datos con valores por defecto
      const productData = {
        nombre: data.name.trim(),
        descripcion: data.description?.trim() || '',
        precio: parseFloat(data.price),
        stock: data.stock ? parseInt(data.stock) : 0,
        categoriaId: categoryId,
        vendedorId: vendor.id,
        imagenUrl: data.image || null,
        sku: data.sku && data.sku.trim() !== '' ? data.sku.trim() : null,
        esActivo: true,
      };

      console.log('📦 Datos a crear:', JSON.stringify(productData, null, 2));

      const product = await this.prisma.product.create({
        data: productData,
        include: {
          categoria: true,
          vendedor: true,
        },
      });

      console.log('✅ Producto creado exitosamente:', product.id);

      return {
        success: true,
        message: 'Producto creado exitosamente',
        product,
      };
    } catch (error) {
      console.error('❌ Error creating store product:', error);
      console.error('❌ Error stack:', error.stack);

      // Mensajes de error más específicos
      if (error.code === 'P2003') {
        throw new BadRequestException('Error: La categoría seleccionada no existe. Por favor, intenta de nuevo.');
      }

      if (error.code === 'P2002') {
        const target = error.meta?.target || 'campo desconocido';
        console.error('❌ P2002 - Campo duplicado:', target);
        throw new BadRequestException(`Error: Valor duplicado en ${target}. Por favor, usa un valor diferente.`);
      }

      throw new BadRequestException(`Error al crear el producto: ${error.message}`);
    }
  }

  // Importar productos desde Excel
  async importProducts(userId: number, file: Express.Multer.File) {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
      });

      if (!vendor) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      let createdCount = 0;
      const errors: any[] = [];

      for (const item of data as any[]) {
        try {
          // Mapeo de columnas (flexible)
          const nombre = item['Nombre'] || item['nombre'] || item['Name'];
          const precio = item['Precio'] || item['precio'] || item['Price'];
          const stock = item['Stock'] || item['stock'] || 0;
          const descripcion = item['Descripcion'] || item['descripcion'] || '';
          const categoriaId = item['CategoriaId'] || item['categoriaId'] || 1;
          const sku = item['SKU'] || item['sku'] || null;
          const imagenUrl = item['Imagen'] || item['imagen'] || item['Image'] || null;

          if (!nombre || !precio) continue;

          await this.prisma.product.create({
            data: {
              nombre: String(nombre),
              descripcion: String(descripcion),
              precio: parseFloat(precio),
              stock: parseInt(stock),
              categoriaId: parseInt(categoriaId),
              vendedorId: vendor.id,
              sku: sku ? String(sku) : null,
              imagenUrl: imagenUrl ? String(imagenUrl) : null,
              esActivo: true,
            },
          });
          createdCount++;
        } catch (err) {
          errors.push({ item, error: err.message });
        }
      }

      return {
        success: true,
        message: `Importados ${createdCount} productos. ${errors.length} errores.`,
        createdCount,
        errors,
      };
    } catch (error) {
      console.error('Error importing products:', error);
      throw new BadRequestException('Error al importar productos');
    }
  }

  // Actualizar producto de tienda
  async updateStoreProduct(userId: number, productId: number, data: any) {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
      });

      if (!vendor) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      // Verificar propiedad
      const existingProduct = await this.prisma.product.findFirst({
        where: { id: productId, vendedorId: vendor.id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Producto no encontrado o no pertenece al vendedor');
      }

      const product = await this.prisma.product.update({
        where: { id: productId },
        data: {
          nombre: data.name,
          descripcion: data.description,
          precio: data.price ? parseFloat(data.price) : undefined,
          stock: data.stock ? parseInt(data.stock) : undefined,
          categoriaId: data.categoryId ? parseInt(data.categoryId) : undefined,
          imagenUrl: data.image,
          sku: data.sku && data.sku.trim() !== '' ? data.sku.trim() : null,
        },
      });

      return {
        success: true,
        message: 'Producto actualizado exitosamente',
        product,
      };
    } catch (error) {
      console.error('Error updating store product:', error);
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  // Toggle estado producto
  async toggleStoreProduct(userId: number, productId: number) {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: { usuarioId: userId },
      });

      if (!vendor) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      const product = await this.prisma.product.findFirst({
        where: { id: productId, vendedorId: vendor.id },
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      const updated = await this.prisma.product.update({
        where: { id: productId },
        data: { esActivo: !product.esActivo },
      });

      return {
        success: true,
        message: `Producto ${updated.esActivo ? 'activado' : 'desactivado'}`,
        product: updated,
      };
    } catch (error) {
      console.error('Error toggling store product:', error);
      throw new BadRequestException('Error al cambiar estado del producto');
    }
  }
}
