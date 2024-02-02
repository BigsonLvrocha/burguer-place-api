import { Controller, Get, UseFilters } from '@nestjs/common';
import { ListIngredientsUseCase } from '../../../use-cases/list-ingredients-use-case.js';
import { AllExceptionsFilter } from './exception-handler.js';

@UseFilters(AllExceptionsFilter)
@Controller('ingredient-amount')
export class IngredientAmountController {
  constructor(
    private readonly listIngredientAmountUseCase: ListIngredientsUseCase,
  ) {}

  @Get()
  async get() {
    const data = await this.listIngredientAmountUseCase.execute();
    return {
      data: data.map((ingredient) => ({
        type: 'ingredientAmount',
        attributes: {
          name: ingredient.name,
          amount: ingredient.amount,
        },
      })),
    };
  }
}
