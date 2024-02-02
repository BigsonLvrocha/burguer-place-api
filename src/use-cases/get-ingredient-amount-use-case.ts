import { Inject } from '@nestjs/common';
import {
  IngredientStorageService,
  ingredientStorageServiceToken,
} from '../domain/ingredient-storage-service.js';
import { UseCase } from './use-case.js';

type GetIngredientAmountUseCaseRequest = {
  name: string;
};

type GetIngredientAmountUseCaseResponse = {
  name: string;
  amount: number;
};

export class GetIngredientAmountUseCase
  implements
    UseCase<
      GetIngredientAmountUseCaseRequest,
      GetIngredientAmountUseCaseResponse
    >
{
  constructor(
    @Inject(ingredientStorageServiceToken)
    private readonly ingredientStorageService: IngredientStorageService,
  ) {}

  async execute({ name }: { name: string }) {
    const amount =
      await this.ingredientStorageService.getIngredientAmount(name);

    return { name, amount: amount.quantity };
  }
}
