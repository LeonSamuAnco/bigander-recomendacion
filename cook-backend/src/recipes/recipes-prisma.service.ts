import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFiltersDto } from './dto/recipe-filters.dto';

@Injectable()
export class RecipesPrismaService {
  private readonly logger = new Logger(RecipesPrismaService.name);

  constructor(private prisma: PrismaService) {}

  // Crear una nueva receta
  async create(createRecipeDto: CreateRecipeDto, autorId?: number) {
    try {
      const recipe = await this.prisma.recipe.create({
        data: {
          nombre: createRecipeDto.nombre,
          descripcion: createRecipeDto.descripcion,
          categoriaRecetaId: createRecipeDto.categoriaRecetaId,
          dificultadId: createRecipeDto.dificultadId,
          tiempoPreparacion: createRecipeDto.tiempoPreparacion,
          tiempoCoccion: createRecipeDto.tiempoCoccion || 0,
          tiempoTotal:
            createRecipeDto.tiempoPreparacion +
            (createRecipeDto.tiempoCoccion || 0),
          porciones: createRecipeDto.porciones,
          instrucciones: createRecipeDto.instrucciones,
          imagenPrincipal: createRecipeDto.imagenPrincipal,
          tipsCocina: createRecipeDto.tipsCocina,
          origenPais: createRecipeDto.origenPais || 'Perú',
          esVegetariana: createRecipeDto.esVegetariana || false,
          esVegana: createRecipeDto.esVegana || false,
          sinGluten: createRecipeDto.sinGluten || false,
          sinLactosa: createRecipeDto.sinLactosa || false,
          esSaludable: createRecipeDto.esSaludable || false,
          autorId: autorId,
          ingredientes: {
            create: createRecipeDto.ingredientes.map((ing, index) => ({
              ingredienteMaestroId: ing.ingredienteMaestroId,
              cantidad: ing.cantidad,
              unidadMedidaId: ing.unidadMedidaId,
              esOpcional: ing.esOpcional || false,
              esPrincipal: ing.esPrincipal || false,
              notas: ing.notas,
              ordenAparicion: ing.ordenAparicion || index + 1,
            })),
          },
        },
        include: {
          categoria: true,
          dificultad: true,
          ingredientes: {
            include: {
              ingredienteMaestro: true,
              unidadMedida: true,
            },
          },
        },
      });

      this.logger.log(`Receta creada: ${recipe.nombre} (ID: ${recipe.id})`);
      return recipe;
    } catch (error) {
      this.logger.error('Error creando receta:', error);
      throw new InternalServerErrorException('Error al crear la receta');
    }
  }

  // Obtener todas las recetas con filtros
  async findAll(filters?: RecipeFiltersDto) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {
        esActivo: true,
      };

      // Aplicar filtros
      if (filters?.search) {
        where.OR = [
          { nombre: { contains: filters.search, mode: 'insensitive' } },
          { descripcion: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters?.categoriaId) {
        where.categoriaRecetaId = filters.categoriaId;
      }

      if (filters?.dificultadId) {
        where.dificultadId = filters.dificultadId;
      }

      if (filters?.tiempoMax) {
        where.tiempoTotal = { lte: filters.tiempoMax };
      }

      if (filters?.porcionesMin || filters?.porcionesMax) {
        where.porciones = {};
        if (filters.porcionesMin) where.porciones.gte = filters.porcionesMin;
        if (filters.porcionesMax) where.porciones.lte = filters.porcionesMax;
      }

      if (filters?.esVegetariana) where.esVegetariana = true;
      if (filters?.esVegana) where.esVegana = true;
      if (filters?.sinGluten) where.sinGluten = true;
      if (filters?.sinLactosa) where.sinLactosa = true;
      if (filters?.esSaludable) where.esSaludable = true;

      if (filters?.origenPais) {
        where.origenPais = {
          contains: filters.origenPais,
          mode: 'insensitive',
        };
      }

      // Filtro por ingredientes
      if (filters?.ingredientes && filters.ingredientes.length > 0) {
        where.ingredientes = {
          some: {
            ingredienteMaestroId: {
              in: filters.ingredientes,
            },
          },
        };
      }

      // Ordenamiento
      const orderBy: any = {};
      if (filters?.sortBy) {
        orderBy[filters.sortBy] = filters?.sortOrder || 'desc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const [recipes, total] = await Promise.all([
        this.prisma.recipe.findMany({
          where,
          include: {
            categoria: true,
            dificultad: true,
            ingredientes: {
              include: {
                ingredienteMaestro: true,
                unidadMedida: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.recipe.count({ where }),
      ]);

      return {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error obteniendo recetas:', error);
      throw new InternalServerErrorException('Error al obtener las recetas');
    }
  }

  // Buscar recetas por ingredientes disponibles
  async findByIngredients(ingredientIds: number[]) {
    try {
      if (!ingredientIds || ingredientIds.length === 0) {
        throw new BadRequestException(
          'Debe proporcionar al menos un ingrediente',
        );
      }

      const recipes = await this.prisma.recipe.findMany({
        where: {
          esActivo: true,
          ingredientes: {
            some: {
              ingredienteMaestroId: {
                in: ingredientIds,
              },
            },
          },
        },
        include: {
          categoria: true,
          dificultad: true,
          ingredientes: {
            include: {
              ingredienteMaestro: true,
              unidadMedida: true,
            },
          },
        },
        orderBy: {
          calificacionPromedio: 'desc',
        },
      });

      // Calcular porcentaje de coincidencia de ingredientes
      const recipesWithMatch = recipes.map((recipe) => {
        const recipeIngredientIds = recipe.ingredientes.map(
          (ing) => ing.ingredienteMaestroId,
        );
        const matchingIngredients = recipeIngredientIds.filter((id) =>
          ingredientIds.includes(id),
        );
        const matchPercentage =
          (matchingIngredients.length / recipeIngredientIds.length) * 100;

        return {
          ...recipe,
          matchPercentage: Math.round(matchPercentage),
          matchingIngredients: matchingIngredients.length,
          totalIngredients: recipeIngredientIds.length,
        };
      });

      // Ordenar por porcentaje de coincidencia
      recipesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

      this.logger.log(
        `Encontradas ${recipesWithMatch.length} recetas para ${ingredientIds.length} ingredientes`,
      );
      return recipesWithMatch;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error buscando recetas por ingredientes:', error);
      throw new InternalServerErrorException(
        'Error al buscar recetas por ingredientes',
      );
    }
  }

  // Obtener ingredientes maestros
  async findAllIngredients() {
    try {
      return await this.prisma.masterIngredient.findMany({
        where: { esActivo: true },
        include: {
          unidadMedidaBase: true,
        },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error obteniendo ingredientes:', error);
      throw new InternalServerErrorException(
        'Error al obtener los ingredientes',
      );
    }
  }

  // Obtener una receta por ID
  async findOne(id: number) {
    try {
      const recipe = await this.prisma.recipe.findUnique({
        where: { id, esActivo: true },
        include: {
          categoria: true,
          dificultad: true,
          ingredientes: {
            include: {
              ingredienteMaestro: true,
              unidadMedida: true,
            },
            orderBy: { ordenAparicion: 'asc' },
          },
        },
      });

      if (!recipe) {
        throw new NotFoundException(`Receta con ID ${id} no encontrada`);
      }

      return recipe;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error obteniendo receta ${id}:`, error);
      throw new InternalServerErrorException('Error al obtener la receta');
    }
  }

  // Obtener categorías de recetas
  async findAllCategories() {
    try {
      return await this.prisma.recipeCategory.findMany({
        where: { esActivo: true },
        orderBy: { ordenMostrar: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error obteniendo categorías:', error);
      throw new InternalServerErrorException(
        'Error al obtener las categorías',
      );
    }
  }

  // Obtener dificultades de recetas
  async findAllDifficulties() {
    try {
      return await this.prisma.recipeDifficulty.findMany({
        orderBy: { orden: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error obteniendo dificultades:', error);
      throw new InternalServerErrorException(
        'Error al obtener las dificultades',
      );
    }
  }

  // Obtener unidades de medida
  async findAllMeasurementUnits() {
    try {
      return await this.prisma.measurementUnit.findMany({
        where: { esActivo: true },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      this.logger.error('Error obteniendo unidades de medida:', error);
      throw new InternalServerErrorException(
        'Error al obtener las unidades de medida',
      );
    }
  }

  // ========================================
  // MÉTODOS DE FAVORITAS
  // ========================================

  // Agregar receta a favoritas
  async addToFavorites(recetaId: number, usuarioId: number) {
    try {
      // Verificar que la receta existe
      const recipe = await this.prisma.recipe.findUnique({
        where: { id: recetaId, esActivo: true },
      });

      if (!recipe) {
        throw new NotFoundException('Receta no encontrada');
      }

      // Verificar si ya está en favoritas
      const existingFavorite = await this.prisma.userFavoriteRecipe.findUnique({
        where: {
          uk_usuario_receta: {
            usuarioId,
            recetaId,
          },
        },
      });

      if (existingFavorite) {
        return {
          success: true,
          message: 'La receta ya está en favoritas',
          isFavorite: true,
        };
      }

      // Agregar a favoritas
      await this.prisma.userFavoriteRecipe.create({
        data: {
          usuarioId,
          recetaId,
        },
      });

      // Incrementar contador de favoritas en la receta
      await this.prisma.recipe.update({
        where: { id: recetaId },
        data: {
          vecesFavorita: {
            increment: 1,
          },
        },
      });

      this.logger.log(`Receta ${recetaId} agregada a favoritas del usuario ${usuarioId}`);

      return {
        success: true,
        message: 'Receta agregada a favoritas',
        isFavorite: true,
      };
    } catch (error) {
      this.logger.error('Error agregando a favoritas:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al agregar a favoritas');
    }
  }

  // Quitar receta de favoritas
  async removeFromFavorites(recetaId: number, usuarioId: number) {
    try {
      // Verificar si está en favoritas
      const favorite = await this.prisma.userFavoriteRecipe.findUnique({
        where: {
          uk_usuario_receta: {
            usuarioId,
            recetaId,
          },
        },
      });

      if (!favorite) {
        return {
          success: true,
          message: 'La receta no estaba en favoritas',
          isFavorite: false,
        };
      }

      // Quitar de favoritas
      await this.prisma.userFavoriteRecipe.delete({
        where: {
          uk_usuario_receta: {
            usuarioId,
            recetaId,
          },
        },
      });

      // Decrementar contador de favoritas en la receta
      await this.prisma.recipe.update({
        where: { id: recetaId },
        data: {
          vecesFavorita: {
            decrement: 1,
          },
        },
      });

      this.logger.log(`Receta ${recetaId} quitada de favoritas del usuario ${usuarioId}`);

      return {
        success: true,
        message: 'Receta quitada de favoritas',
        isFavorite: false,
      };
    } catch (error) {
      this.logger.error('Error quitando de favoritas:', error);
      throw new InternalServerErrorException('Error al quitar de favoritas');
    }
  }

  // Obtener recetas favoritas del usuario
  async getUserFavorites(usuarioId: number) {
    try {
      const favorites = await this.prisma.userFavoriteRecipe.findMany({
        where: {
          usuarioId,
        },
        include: {
          receta: {
            include: {
              categoria: true,
              dificultad: true,
              ingredientes: {
                include: {
                  ingredienteMaestro: true,
                  unidadMedida: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const recipes = favorites.map((fav) => fav.receta);

      return {
        recipes,
        total: recipes.length,
      };
    } catch (error) {
      this.logger.error('Error obteniendo favoritas:', error);
      throw new InternalServerErrorException('Error al obtener favoritas');
    }
  }

  // Verificar si una receta es favorita del usuario
  async isFavorite(recetaId: number, usuarioId: number) {
    try {
      const favorite = await this.prisma.userFavoriteRecipe.findUnique({
        where: {
          uk_usuario_receta: {
            usuarioId,
            recetaId,
          },
        },
      });

      return {
        isFavorite: !!favorite,
      };
    } catch (error) {
      this.logger.error('Error verificando favorita:', error);
      throw new InternalServerErrorException('Error al verificar favorita');
    }
  }
}
