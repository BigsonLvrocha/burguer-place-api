import { Recipe } from './recipe.js';

export interface RecipeRepository {
  list(): Promise<Recipe[]>;
  get(recipeId: string): Promise<Recipe | null>;
  save(recipe: Recipe): Promise<void>;
  delete(recipeId: string): Promise<void>;
}
