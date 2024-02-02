import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { CreateOrUpdateRecipeUseCase } from './create-or-update-recipe-use-case.js';
import { ListRecipesUseCase } from './list-recipes-use-case.js';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateOrUpdateRecipeUseCase, ListRecipesUseCase],
  exports: [CreateOrUpdateRecipeUseCase, ListRecipesUseCase],
})
export class UseCaseModule {}
