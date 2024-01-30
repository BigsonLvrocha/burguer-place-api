import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { RecipeIngredient } from './recipe-ingredient.js';
import { Recipe } from './recipe.js';

describe('recipe', () => {
  it('creates a recipe', () => {
    const recipe = new Recipe({
      name: 'Grilled Cheese',
      ingredients: [
        new RecipeIngredient({ ingredient: 'cheese', quantity: 1 }),
        new RecipeIngredient({ ingredient: 'bread', quantity: 2 }),
      ],
    });

    expect(recipe).toBeInstanceOf(Recipe);
    expect(recipe.name).toBe('Grilled Cheese');
    expect(recipe.ingredients).toHaveLength(2);
  });

  it('throws error if the recipe name is empty', () => {
    expect(() => new Recipe({ name: '', ingredients: [] })).toThrow(
      InvalidRecipeNameException,
    );
  });

  it('throws error if the recipe has no ingredients', () => {
    expect(
      () => new Recipe({ name: 'Grilled Cheese', ingredients: [] }),
    ).toThrow(InvalidRecipeIngredientsQuantityException);
  });
});
