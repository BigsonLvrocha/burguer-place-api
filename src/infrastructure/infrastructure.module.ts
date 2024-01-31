import { Module } from '@nestjs/common';

import { recipeRepositoryToken } from '../domain/recipe-repository.js';

import { DbModule } from './db/db.module.js';
import { SequelizeRecipeRepository } from './sequelize-recipe-repository.js';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: recipeRepositoryToken,
      useClass: SequelizeRecipeRepository,
    },
  ],
  exports: [recipeRepositoryToken],
})
export class InfrastructureModule {}
