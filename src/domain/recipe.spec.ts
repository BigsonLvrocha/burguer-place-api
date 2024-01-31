import { validate } from 'uuid';
import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { IngredientAmount } from './ingredient-amount.js';
import { Recipe } from './recipe.js';

describe('recipe', () => {
  describe('valid recipe', () => {
    const recipe = new Recipe({
      name: 'Grilled Cheese',
      ingredients: [
        new IngredientAmount({ ingredient: 'cheese', quantity: 1 }),
        new IngredientAmount({ ingredient: 'bread', quantity: 2 }),
      ],
    });

    it('is a valid recipe instance', () => {
      expect(recipe).toBeInstanceOf(Recipe);
    });

    it('has the name given', () => {
      expect(recipe.name).toBe('Grilled Cheese');
    });

    it('has the ingredients passed', () => {
      expect(recipe.ingredients).toHaveLength(2);
    });

    it('creates with a generated uuid id', () => {
      expect(validate(recipe.id)).toBe(true);
    });
  });

  it('throws error if the recipe name is empty', () => {
    expect(
      () =>
        new Recipe({
          name: '',
          ingredients: [
            new IngredientAmount({ ingredient: 'cheese', quantity: 1 }),
          ],
        }),
    ).toThrow(InvalidRecipeNameException);
  });

  it('throws error if the recipe has no ingredients', () => {
    expect(
      () =>
        new Recipe({
          name: 'Grilled Cheese',
          ingredients: [],
        }),
    ).toThrow(InvalidRecipeIngredientsQuantityException);
  });
});
