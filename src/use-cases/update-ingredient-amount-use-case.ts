import { Inject, Injectable } from '@nestjs/common';
import {
  IngredientAmount,
  IngredientStorageService,
  ingredientStorageServiceToken,
} from '../domain/index.js';
import { UseCase } from './use-case.js';

type UpdateIngredientAmountUseCaseRequest = {
  ingredient: string;
  quantity: number;
};

@Injectable()
export class UpdateIngredientAmountUseCase
  implements
    UseCase<
      UpdateIngredientAmountUseCaseRequest,
      UpdateIngredientAmountUseCaseRequest
    >
{
  constructor(
    @Inject(ingredientStorageServiceToken)
    private readonly ingredientStorageService: IngredientStorageService,
  ) {
    this.ingredientStorageService = ingredientStorageService;
  }

  async execute(data: UpdateIngredientAmountUseCaseRequest) {
    const amount = new IngredientAmount({
      ingredient: data.ingredient,
      quantity: data.quantity,
    });
    await this.ingredientStorageService.updateIngredientAmount(amount);
    return {
      ingredient: amount.ingredient,
      quantity: amount.quantity,
    };
  }
}
