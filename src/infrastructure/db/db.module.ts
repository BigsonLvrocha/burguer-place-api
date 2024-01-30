import { Module } from '@nestjs/common';
import { ingredientModelProvider, ingredientModelToken } from './ingredient.js';
import {
  recipeIngredientModelProvider,
  recipeIngredientModelToken,
} from './recipe-ingredient.js';
import { recipeModelProvider, recipeModelToken } from './recipe.js';
import { sequelizeProvider } from './sequelize.js';
import { storeModelProvider, storeModelToken } from './store.js';

@Module({
  providers: [
    sequelizeProvider,
    storeModelProvider,
    ingredientModelProvider,
    recipeModelProvider,
    recipeIngredientModelProvider,
  ],
  exports: [
    storeModelToken,
    ingredientModelToken,
    recipeModelToken,
    recipeIngredientModelToken,
  ],
})
export class DbModule {}
