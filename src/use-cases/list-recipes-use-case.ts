import { Inject, Injectable } from '@nestjs/common';
import { RecipeRepository, recipeRepositoryToken } from '../domain/index.js';
import { UseCase } from './use-case.js';

type ListRecipesUseCaseResponse = {
  id: string;
  name: string;
  ingredients: {
    name: string;
    amount: number;
  }[];
};

@Injectable()
export class ListRecipesUseCase
  implements UseCase<undefined, ListRecipesUseCaseResponse[]>
{
  constructor(
    @Inject(recipeRepositoryToken)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(): Promise<ListRecipesUseCaseResponse[]> {
    const recipes = await this.recipeRepository.list();

    return recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.ingredient,
        amount: ingredient.quantity,
      })),
    }));
  }
}
