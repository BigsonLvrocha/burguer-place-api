import { IngredientAmount } from './ingredient-amount.js';
import { Recipe } from './recipe.js';

export interface IngredientStorageService {
  updateStoreIngredientAmount(
    storeId: string,
    amount: IngredientAmount,
  ): Promise<void>;

  getStoreIngredientAmount(
    storeId: string,
    ingredient: string,
  ): Promise<IngredientAmount>;

  processRecipe(storeId: string, recipe: Recipe): Promise<void>;
}
