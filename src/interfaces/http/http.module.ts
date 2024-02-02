import { Module } from '@nestjs/common';
import { UseCaseModule } from '../../use-cases/use-case.module.js';
import { IngredientAmountController } from './controllers/ingredient-amount.controller.js';
import { RecipeController } from './controllers/recipe.controller.js';

@Module({
  imports: [UseCaseModule],
  controllers: [RecipeController, IngredientAmountController],
})
export class HttpModule {}
