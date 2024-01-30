import { InvalidIngredientNameException } from './errors/invalid-ingredient-name-exception.js';
import { InvalidIngredientQuantityException } from './errors/invalid-ingredient-quantity-quantity-exception.js';
import { RecipeIngredient } from './recipe-ingredient.js';

describe('recipe ingredient', () => {
  it('creates a recipe ingredient', () => {
    const recipeIngredient = new RecipeIngredient({
      ingredient: 'cheese',
      quantity: 1,
    });

    expect(recipeIngredient).toBeInstanceOf(RecipeIngredient);
    expect(recipeIngredient.ingredient).toBe('cheese');
    expect(recipeIngredient.quantity).toBe(1);
  });

  it('throws an error if the quantity is less than or equal to 0', () => {
    expect(
      () => new RecipeIngredient({ ingredient: 'cheese', quantity: 0 }),
    ).toThrow(InvalidIngredientQuantityException);
  });

  it('throws an error if the ingredient name is empty', () => {
    expect(() => new RecipeIngredient({ ingredient: '', quantity: 1 })).toThrow(
      InvalidIngredientNameException,
    );
  });
});
