import { Recipe } from './recipe.js';

export const recipeRepositoryToken = Symbol('RecipeRepository');

export interface RecipeRepository {
  list(): Promise<Recipe[]>;
  get(recipeId: string): Promise<Recipe | null>;
  save(recipe: Recipe): Promise<void>;
  delete(recipeId: string): Promise<void>;
}
