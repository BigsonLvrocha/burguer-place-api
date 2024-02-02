import { Inject } from '@nestjs/common';
import { RecipeRepository, recipeRepositoryToken } from '../domain/index.js';
import { UseCase } from './use-case.js';

type GetRecipeUseCaseRequest = {
  id: string;
};

type GetRecipeUseCaseResponse = {
  id: string;
  name: string;
  ingredients: {
    name: string;
    amount: number;
  }[];
} | null;

export class GetRecipeUseCase
  implements UseCase<GetRecipeUseCaseRequest, GetRecipeUseCaseResponse>
{
  constructor(
    @Inject(recipeRepositoryToken) private recipeRepository: RecipeRepository,
  ) {}

  async execute(
    request: GetRecipeUseCaseRequest,
  ): Promise<GetRecipeUseCaseResponse> {
    const recipe = await this.recipeRepository.get(request.id);

    if (!recipe) {
      return null;
    }

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
