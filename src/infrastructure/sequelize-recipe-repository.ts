import { Inject, Injectable } from '@nestjs/common';

import { Recipe, RecipeRepository } from '../domain/index.js';

import {
  IngredientModelStatic,
  RecipeIngredientModelStatic,
  RecipeModelStatic,
  ingredientModelToken,
  recipeIngredientModelToken,
  recipeModelToken,
} from './db/index.js';

@Injectable()
export class SequelizeRecipeRepository implements RecipeRepository {
  constructor(
    @Inject(recipeModelToken)
    private readonly recipeModel: RecipeModelStatic,

    @Inject(recipeIngredientModelToken)
    private readonly recipeIngredientModel: RecipeIngredientModelStatic,

    @Inject(ingredientModelToken)
    private readonly ingredientModel: IngredientModelStatic,
  ) {}

  list(): Promise<Recipe[]> {
    throw new Error('Method not implemented.');
  }

  get(recipeId: string): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }

  async save(recipe: Recipe): Promise<void> {
    await this.recipeModel.sequelize.transaction(async (transaction) => {
      const [createdRecipe] = await this.recipeModel.upsert(
        {
          id: recipe.id,
          name: recipe.name,
        },
        { transaction },
      );

      const currentRecipeIngredients = await this.recipeIngredientModel.findAll(
        {
          where: { recipeId: createdRecipe.id },
          transaction,
        },
      );

      const recipeIngredientsToPut = await Promise.all(
        recipe.ingredients.map(async (ingredient) => {
          const [createdIngredient] = await this.ingredientModel.upsert(
            { name: ingredient.ingredient },
            { transaction },
          );

          return {
            ingredientId: createdIngredient.id,
            recipeId: createdRecipe.id,
            amount: ingredient.quantity,
          };
        }),
      );

      const recipeIngredientsToPutMap = new Map(
        recipeIngredientsToPut.map((recipeIngredient) => [
          recipeIngredient.ingredientId,
          recipeIngredient,
        ]),
      );

      const recipeIngredientsToDelete = currentRecipeIngredients.filter(
        (currentRecipeIngredient) =>
          !recipeIngredientsToPutMap.has(currentRecipeIngredient.ingredientId),
      );

      await Promise.all([
        this.recipeIngredientModel.destroy({
          where: {
            id: recipeIngredientsToDelete.map(
              (recipeIngredient) => recipeIngredient.id,
            ),
          },
          transaction,
        }),
        this.recipeIngredientModel.bulkCreate(recipeIngredientsToPut, {
          transaction,
          updateOnDuplicate: ['amount'],
        }),
      ]);
    });
  }

  delete(recipeId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
