import { Inject, Injectable } from '@nestjs/common';

import {
  IngredientStorageService,
  ingredientStorageServiceToken,
} from '../domain/ingredient-storage-service.js';
import {
  RecipeRepository,
  recipeRepositoryToken,
} from '../domain/recipe-repository.js';
import { RecipeNotFoundException } from './exceptions/recipe-not-found-exception.js';
import { UseCase } from './use-case.js';

type ProcessRecipeUseCaseRequest = {
  recipeId: string;
};

@Injectable()
export class ProcessRecipeUseCase
  implements UseCase<ProcessRecipeUseCaseRequest, undefined>
{
  constructor(
    @Inject(recipeRepositoryToken) private recipeRepository: RecipeRepository,
    @Inject(ingredientStorageServiceToken)
    private ingredientStorageService: IngredientStorageService,
  ) {}

  async execute({ recipeId }: ProcessRecipeUseCaseRequest): Promise<undefined> {
    const recipe = await this.recipeRepository.get(recipeId);

    if (!recipe) {
      throw new RecipeNotFoundException(recipeId);
    }

    await this.ingredientStorageService.processRecipe(recipe);
  }
}
