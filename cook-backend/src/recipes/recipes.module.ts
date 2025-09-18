import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';

@Module({
  imports: [
    // Hacemos que las entidades estén disponibles dentro de este módulo
    TypeOrmModule.forFeature([Recipe, Ingredient]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
