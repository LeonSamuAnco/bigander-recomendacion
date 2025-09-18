import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('api')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('ingredients')
  findAllIngredients() {
    return this.recipesService.findAllIngredients();
  }

  @Get('recipes')
  findRecipes(@Query('ingredients') ingredientsQuery: string) {
    // El query param llega como un string "Pollo,Tomate,Arroz"
    // Lo convertimos en un array: ["Pollo", "Tomate", "Arroz"]
    const ingredientList = ingredientsQuery ? ingredientsQuery.split(',') : [];
    return this.recipesService.findRecipes(ingredientList);
  }

  @Get('recipes/:id')
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipesService.findOne(Number(id));
    if (!recipe) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }
    return recipe;
  }
}
