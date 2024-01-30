import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { IngredientAmount } from './ingredient-amount.js';

type RecipeProps = {
  name: string;
  ingredients: IngredientAmount[];
  storeId: string;
};

export class Recipe {
  public readonly name: string;
  public readonly ingredients: IngredientAmount[];
  public readonly storeId: string;

  constructor(props: RecipeProps) {
    if (props.ingredients.length === 0) {
      throw new InvalidRecipeIngredientsQuantityException();
    }

    this.name = this.parseRecipeName(props.name);
    this.ingredients = props.ingredients;
    this.storeId = props.storeId;
  }

  private parseRecipeName(name: string): string {
    const parsedName = name.trim();

    if (parsedName === '') {
      throw new InvalidRecipeNameException();
    }

    return parsedName;
  }
}
