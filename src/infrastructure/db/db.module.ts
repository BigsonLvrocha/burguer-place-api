import { Module } from '@nestjs/common';
import { ingredientModelProvider, ingredientModelToken } from './ingredient.js';
import {
  recipeIngredientModelProvider,
  recipeIngredientModelToken,
} from './recipe-ingredient.js';
import { recipeModelProvider, recipeModelToken } from './recipe.js';
import { SequelizeTearDown } from './sequelize-teardown.js';
import { dbConfigurationProvider, sequelizeProvider } from './sequelize.js';

@Module({
  providers: [
    dbConfigurationProvider,
    sequelizeProvider,
    ingredientModelProvider,
    recipeModelProvider,
    recipeIngredientModelProvider,
    SequelizeTearDown,
  ],
  exports: [ingredientModelToken, recipeModelToken, recipeIngredientModelToken],
})
export class DbModule {}
