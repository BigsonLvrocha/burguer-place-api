import { IngredientAmount } from './ingredient-amount.js';
import { Recipe } from './recipe.js';

export interface IngredientStorageService {
  updateIngredientAmount(amount: IngredientAmount): Promise<void>;

  listIngredients(): Promise<IngredientAmount[]>;

  getIngredientAmount(ingredient: string): Promise<IngredientAmount>;

  processRecipe(recipe: Recipe): Promise<void>;
}

export const ingredientStorageServiceToken = Symbol('IngredientStorageService');
