import { v4 as uuid } from 'uuid';
import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { IngredientAmount } from './ingredient-amount.js';

type RecipeProps = {
  id?: string;
  name: string;
  ingredients: IngredientAmount[];
};

export class Recipe {
  public readonly id: string;
  public readonly name: string;
  public readonly ingredients: IngredientAmount[];

  constructor(props: RecipeProps) {
    if (props.ingredients.length === 0) {
      throw new InvalidRecipeIngredientsQuantityException();
    }

    this.name = this.parseRecipeName(props.name);
    this.id = props.id ?? uuid();
    this.ingredients = props.ingredients;
  }

  private parseRecipeName(name: string): string {
    const parsedName = name.trim();

    if (parsedName === '') {
      throw new InvalidRecipeNameException();
    }

    return parsedName;
  }
}
