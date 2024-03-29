import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { CreateOrUpdateRecipeUseCase } from './create-or-update-recipe-use-case.js';
import { DeleteRecipeUseCase } from './delete-recipe-use-case.js';
import { GetIngredientAmountUseCase } from './get-ingredient-amount-use-case.js';
import { GetRecipeUseCase } from './get-recipe-use-case.js';
import { ListIngredientsUseCase } from './list-ingredients-use-case.js';
import { ListRecipesUseCase } from './list-recipes-use-case.js';
import { ProcessRecipeUseCase } from './process-recipe-use-case.js';
import { UpdateIngredientAmountUseCase } from './update-ingredient-amount-use-case.js';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateOrUpdateRecipeUseCase,
    ListRecipesUseCase,
    GetRecipeUseCase,
    DeleteRecipeUseCase,
    UpdateIngredientAmountUseCase,
    ListIngredientsUseCase,
    ProcessRecipeUseCase,
    GetIngredientAmountUseCase,
  ],
  exports: [
    CreateOrUpdateRecipeUseCase,
    ListRecipesUseCase,
    GetRecipeUseCase,
    DeleteRecipeUseCase,
    UpdateIngredientAmountUseCase,
    ListIngredientsUseCase,
    ProcessRecipeUseCase,
    GetIngredientAmountUseCase,
  ],
})
export class UseCaseModule {}
