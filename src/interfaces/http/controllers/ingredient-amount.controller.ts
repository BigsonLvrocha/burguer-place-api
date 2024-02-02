import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ListIngredientsUseCase } from '../../../use-cases/list-ingredients-use-case.js';
import { UpdateIngredientAmountUseCase } from '../../../use-cases/update-ingredient-amount-use-case.js';
import { UpdateIngredientAmountDto } from '../dto/update-ingredient-amount.dto.js';
import { AllExceptionsFilter } from './exception-handler.js';

@UseFilters(AllExceptionsFilter)
@Controller('ingredient-amount')
export class IngredientAmountController {
  constructor(
    private readonly listIngredientAmountUseCase: ListIngredientsUseCase,
    private readonly updateIngredientAmountUseCase: UpdateIngredientAmountUseCase,
  ) {}

  @Get()
  @Header('Content-Type', 'application/vnd.api+json')
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

  @Post()
  @Header('Content-Type', 'application/vnd.api+json')
  @HttpCode(200)
  async post(@Body() body: UpdateIngredientAmountDto) {
    const data = await this.updateIngredientAmountUseCase.execute({
      ingredient: body.data.attributes.name,
      quantity: body.data.attributes.amount,
    });
    return {
      data: {
        type: 'ingredientAmount',
        attributes: {
          name: data.ingredient,
          amount: data.quantity,
        },
      },
    };
  }
}
