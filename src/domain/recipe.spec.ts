import { v4 as uuid } from 'uuid';
import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { IngredientAmount } from './ingredient-amount.js';
import { Recipe } from './recipe.js';

describe('recipe', () => {
  it('creates a recipe', () => {
    const recipe = new Recipe({
      name: 'Grilled Cheese',
      ingredients: [
        new IngredientAmount({ ingredient: 'cheese', quantity: 1 }),
        new IngredientAmount({ ingredient: 'bread', quantity: 2 }),
      ],
      storeId: uuid(),
    });

    expect(recipe).toBeInstanceOf(Recipe);
    expect(recipe.name).toBe('Grilled Cheese');
    expect(recipe.ingredients).toHaveLength(2);
  });

  it('throws error if the recipe name is empty', () => {
    expect(
      () => new Recipe({ name: '', ingredients: [], storeId: uuid() }),
    ).toThrow(InvalidRecipeNameException);
  });

  it('throws error if the recipe has no ingredients', () => {
    expect(
      () =>
        new Recipe({
          name: 'Grilled Cheese',
          ingredients: [],
          storeId: uuid(),
        }),
    ).toThrow(InvalidRecipeIngredientsQuantityException);
  });
});
