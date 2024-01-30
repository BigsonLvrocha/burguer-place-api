import { InvalidIngredientNameException } from './errors/invalid-ingredient-name-exception.js';
import { InvalidIngredientQuantityException } from './errors/invalid-ingredient-quantity-quantity-exception.js';
import { IngredientAmount } from './ingredient-amount.js';

describe('ingredient amount', () => {
  it('creates an ingredient amount', () => {
    const ingredientAmount = new IngredientAmount({
      ingredient: 'cheese',
      quantity: 1,
    });

    expect(ingredientAmount).toBeInstanceOf(IngredientAmount);
    expect(ingredientAmount.ingredient).toBe('cheese');
    expect(ingredientAmount.quantity).toBe(1);
  });

  it('throws an error if the quantity is less than or equal to 0', () => {
    expect(
      () => new IngredientAmount({ ingredient: 'cheese', quantity: 0 }),
    ).toThrow(InvalidIngredientQuantityException);
  });

  it('throws an error if the ingredient name is empty', () => {
    expect(() => new IngredientAmount({ ingredient: '', quantity: 1 })).toThrow(
      InvalidIngredientNameException,
    );
  });
});
