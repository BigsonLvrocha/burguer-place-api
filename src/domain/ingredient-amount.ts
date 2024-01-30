import { InvalidIngredientNameException } from './errors/invalid-ingredient-name-exception.js';
import { InvalidIngredientQuantityException } from './errors/invalid-ingredient-quantity-quantity-exception.js';

type IngredientAmountProps = {
  ingredient: string;
  quantity: number;
};

export class IngredientAmount {
  public readonly ingredient: string;
  public readonly quantity: number;

  constructor(props: IngredientAmountProps) {
    if (props.quantity <= 0)
      throw new InvalidIngredientQuantityException(
        props.ingredient,
        props.quantity,
      );

    this.quantity = props.quantity;
    this.ingredient = this.parseIngredientName(props.ingredient);
  }

  private parseIngredientName(ingredient: string): string {
    const parsedIngredient = ingredient.trim();

    if (parsedIngredient === '')
      throw new InvalidIngredientNameException(parsedIngredient);

    return parsedIngredient;
  }
}
