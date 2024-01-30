import { InvalidRecipeIngredientsQuantityException } from './errors/invalid-recipe-ingredients-quantity-exception.js';
import { InvalidRecipeNameException } from './errors/invalid-recipe-name-exception.js';
import { RecipeIngredient } from './recipe-ingredient.js';

type RecipeProps = {
  name: string;
  ingredients: RecipeIngredient[];
};

export class Recipe {
  public readonly name: string;
  public readonly ingredients: RecipeIngredient[];

  constructor(props: RecipeProps) {
    if (props.ingredients.length === 0) {
      throw new InvalidRecipeIngredientsQuantityException();
    }

    this.name = this.parseRecipeName(props.name);
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
