import { Inject } from '@nestjs/common';
import {
  IngredientStorageService,
  ingredientStorageServiceToken,
} from '../domain/ingredient-storage-service.js';
import { UseCase } from './use-case.js';

export class ListIngredientsUseCase
  implements UseCase<undefined, { name: string; amount: number }[]>
{
  constructor(
    @Inject(ingredientStorageServiceToken)
    private readonly ingredientStorageService: IngredientStorageService,
  ) {}

  async execute() {
    const data = await this.ingredientStorageService.listIngredients();

    return data.map((ingredient) => ({
      name: ingredient.ingredient,
      amount: ingredient.quantity,
    }));
  }
}
