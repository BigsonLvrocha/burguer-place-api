import { Injectable } from '@nestjs/common';
import { IngredientAmount } from 'domain/ingredient-amount.js';
import { RecipeRepository } from 'domain/recipe-repository.js';
import { Recipe } from 'domain/recipe.js';
import { UseCase } from './use-case.js';

type CreateOrUpdateRecipeUseCaseRequest = {
  id?: string;
  name: string;
  ingredients: {
    name: string;
    amount: number;
  }[];
};

type CreateOrUpdateRecipeUseCaseResponse = {
  id: string;
  name: string;
  ingredients: {
    name: string;
    amount: number;
  }[];
};

@Injectable()
export class CreateOrUpdateRecipeUseCase
  implements
    UseCase<
      CreateOrUpdateRecipeUseCaseRequest,
      CreateOrUpdateRecipeUseCaseResponse
    >
{
  constructor(private recipeRepository: RecipeRepository) {}

  async execute(
    request: CreateOrUpdateRecipeUseCaseRequest,
  ): Promise<CreateOrUpdateRecipeUseCaseResponse> {
    const recipe = new Recipe({
      id: request.id,
      name: request.name,
      ingredients: request.ingredients.map(
        (ingredient) =>
          new IngredientAmount({
            ingredient: ingredient.name,
            quantity: ingredient.amount,
          }),
      ),
    });

    await this.recipeRepository.save(recipe);

    return {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.ingredient,
        amount: ingredient.quantity,
      })),
    };
  }
}
