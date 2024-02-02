import { Inject, Injectable } from '@nestjs/common';
import { RecipeRepository, recipeRepositoryToken } from '../domain/index.js';
import { RecipeNotFoundException } from './exceptions/recipe-not-found-exception.js';
import { UseCase } from './use-case.js';

@Injectable()
export class DeleteRecipeUseCase implements UseCase<{ id: string }, undefined> {
  constructor(
    @Inject(recipeRepositoryToken)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute({ id }: { id: string }): Promise<undefined> {
    const recipe = await this.recipeRepository.get(id);

    if (!recipe) {
      throw new RecipeNotFoundException(id);
    }

    await this.recipeRepository.delete(id);
  }
}
