import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { RecipeDto } from './dto/recipe.dto';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  async findAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientsRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findRecipes(ingredientNames?: string[]): Promise<RecipeDto[]> {
    try {
      this.logger.log(
        `Buscando recetas con ingredientes: ${
          ingredientNames?.join(', ') ?? 'ninguno'
        }`,
      );

      // Si no hay ingredientes seleccionados, devolver todas las recetas
      if (!ingredientNames || ingredientNames.length === 0) {
        const allRecipes = await this.recipesRepository.find({
          relations: ['ingredients'],
        });
        return this.mapRecipesToDto(allRecipes);
      }

      // Primero, normalizar los nombres de los ingredientes a minúsculas
      const normalizedIngredientNames = ingredientNames.map((name) =>
        name.trim().toLowerCase(),
      );

      // Buscar recetas que contengan AL MENOS UNO de los ingredientes seleccionados
      const recipes = await this.recipesRepository
        .createQueryBuilder('recipe')
        .leftJoinAndSelect('recipe.ingredients', 'ingredient')
        .where('LOWER(ingredient.nombre) IN (:...ingredientNames)', {
          ingredientNames: normalizedIngredientNames,
        })
        .getMany();

      // Si no se encontraron recetas, retornar array vacío
      if (!recipes || recipes.length === 0) {
        this.logger.log(
          'No se encontraron recetas con los ingredientes especificados.',
        );
        return [];
      }

      // Filtrar recetas para asegurar que tengan al menos un ingrediente coincidente
      const filteredRecipes = recipes.filter(
        (recipe) =>
          recipe.ingredients &&
          recipe.ingredients.some(
            (ingredient) =>
              ingredient &&
              ingredient.nombre &&
              normalizedIngredientNames.includes(
                ingredient.nombre.toLowerCase(),
              ),
          ),
      );

      // Si después de filtrar no hay recetas, retornar array vacío
      if (filteredRecipes.length === 0) {
        this.logger.log(
          'No se encontraron recetas con los ingredientes especificados después del filtrado.',
        );
        return [];
      }

      this.logger.log(`Se encontraron ${filteredRecipes.length} recetas.`);
      return this.mapRecipesToDto(filteredRecipes);
    } catch (error: unknown) {
      // Manejo seguro de errores con verificación de tipo
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Falló la búsqueda de recetas: ${errorMessage}`,
        errorStack,
      );
      throw new InternalServerErrorException(
        'Ocurrió un error al buscar las recetas. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  private mapRecipesToDto(recipes: Recipe[]): RecipeDto[] {
    return recipes.map((recipe) => {
      // Usar el operador de encadenamiento opcional y el operador de fusión nula
      const preparationSteps =
        recipe.preparationSteps ??
        (recipe as unknown as { instrucciones?: string }).instrucciones ??
        '';

      const dto: RecipeDto = {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || '',
        time: `${recipe.time} min`,
        servings: recipe.servings,
        difficulty: this.mapDifficulty(recipe.difficulty),
        image: recipe.image,
        ingredients:
          recipe.ingredients && Array.isArray(recipe.ingredients)
            ? recipe.ingredients
                .filter((ing) => ing?.nombre) // Filtrar ingredientes nulos o sin nombre
                .map((ing) => ing.nombre) // Obtener solo los nombres
            : [],
        preparationSteps,
        instrucciones: preparationSteps, // Mantener para compatibilidad
      };

      return dto;
    });
  }

  async findOne(id: number): Promise<RecipeDto | null> {
    try {
      const recipe = await this.recipesRepository.findOne({
        where: { id },
        relations: ['ingredients'],
      });

      if (!recipe) {
        return null;
      }

      // Mapear a DTO
      return {
        id: recipe.id,
        title: recipe.title, // El nombre del campo en la entidad es 'title' (mapeado desde 'nombre')
        description: recipe.description, // Mapeado desde 'descripcion'
        time: `${recipe.time} min`, // Mapeado desde 'tiempo_total'
        servings: recipe.servings, // Mapeado desde 'porciones'
        difficulty: this.mapDifficulty(recipe.difficulty), // Mapeado desde 'dificultad_id'
        image: recipe.image, // Mapeado desde 'imagen_principal'
        preparationSteps:
          recipe.preparationSteps || (recipe as any).instrucciones || '', // Incluir instrucciones de preparación
        ingredients: recipe.ingredients
          ? recipe.ingredients.map((ing) => ing.nombre)
          : [],
      };
    } catch (error) {
      this.logger.error(`Error al buscar receta con ID ${id}:`, error);
      throw new InternalServerErrorException('Error al buscar la receta');
    }
  }

  private mapDifficulty(id: string): string {
    if (!id) return 'No especificada';

    switch (id.toString().trim()) {
      case '1':
        return 'Fácil';
      case '2':
        return 'Medio';
      case '3':
        return 'Difícil';
      case '4':
        return 'Experto';
      default:
        return 'No especificada';
    }
  }
}
