import { Module } from '@nestjs/common';

import { recipeRepositoryToken } from '../domain/recipe-repository.js';

import { ingredientStorageServiceToken } from 'domain/ingredient-storage-service.js';
import { DbModule } from './db/db.module.js';
import { SequelizeIngredientStorageService } from './sequelize-ingredient-storage-service.js';
import { SequelizeRecipeRepository } from './sequelize-recipe-repository.js';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: recipeRepositoryToken,
      useClass: SequelizeRecipeRepository,
    },
    {
      provide: ingredientStorageServiceToken,
      useClass: SequelizeIngredientStorageService,
    },
  ],
  exports: [recipeRepositoryToken, ingredientStorageServiceToken],
})
export class InfrastructureModule {}
