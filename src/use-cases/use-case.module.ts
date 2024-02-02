import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { CreateOrUpdateRecipeUseCase } from './create-or-update-recipe-use-case.js';
import { GetRecipeUseCase } from './get-recipe-use-case.js';
import { ListRecipesUseCase } from './list-recipes-use-case.js';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateOrUpdateRecipeUseCase,
    ListRecipesUseCase,
    GetRecipeUseCase,
  ],
  exports: [CreateOrUpdateRecipeUseCase, ListRecipesUseCase, GetRecipeUseCase],
})
export class UseCaseModule {}
