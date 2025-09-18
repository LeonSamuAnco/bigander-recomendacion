export class RecipeDto {
  id: number;
  title: string;
  description: string;
  time: string;
  servings: number;
  difficulty: string;
  image: string;
  ingredients: string[];
  preparationSteps: string;
  instrucciones?: string; // Campo temporal para compatibilidad
}
