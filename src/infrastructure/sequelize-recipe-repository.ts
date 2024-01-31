import { Inject, Injectable } from '@nestjs/common';

import { IngredientAmount, Recipe, RecipeRepository } from '../domain/index.js';

import { Transaction } from 'sequelize';
import {
  IngredientModelStatic,
  RecipeIngredientModelStatic,
  RecipeModel,
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

  async list(): Promise<Recipe[]> {
    const recepies = await this.recipeModel.findAll({
      include: [this.ingredientModel],
    });
    return recepies.map((recipe) => this.adaptRecipeModelToRecipe(recipe));
  }

  async get(recipeId: string): Promise<Recipe | null> {
    const recipe = await this.recipeModel.findByPk(recipeId, {
      include: [this.ingredientModel],
    });
    if (recipe === null) {
      return null;
    }
    return this.adaptRecipeModelToRecipe(recipe);
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

      await this.handleSaveIngredients(recipe, createdRecipe, transaction);
    });
  }

  async delete(recipeId: string): Promise<void> {
    await this.recipeModel.sequelize.transaction(async (transaction) => {
      await this.recipeIngredientModel.destroy({
        where: { recipeId: recipeId },
        transaction,
      });
      await this.recipeModel.destroy({
        where: { id: recipeId },
        transaction,
      });
    });
  }

  private async handleSaveIngredients(
    recipe: Recipe,
    createdRecipe: RecipeModel,
    transaction: Transaction,
  ): Promise<void> {
    const recipeIngredientsToPut = await this.getRecipesIngredientsToPut(
      recipe,
      transaction,
      createdRecipe,
    );

    const recipeIngredientsToDelete = await this.getRecipesIngredientsToDelete(
      createdRecipe.id,
      recipeIngredientsToPut,
      transaction,
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
  }

  private async getRecipesIngredientsToDelete(
    recipeId: string,
    recipeIngredientsToPut: {
      ingredientId: string;
      recipeId: string;
      amount: number;
    }[],
    transaction: Transaction,
  ) {
    const currentRecipeIngredients = await this.recipeIngredientModel.findAll({
      where: { recipeId },
      transaction,
    });

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
    return recipeIngredientsToDelete;
  }

  private async getRecipesIngredientsToPut(
    recipe: Recipe,
    transaction: Transaction,
    createdRecipe: RecipeModel,
  ) {
    return await Promise.all(
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
  }

  private adaptRecipeModelToRecipe(recipeModel: RecipeModel): Recipe {
    const ingredients = recipeModel.ingredients.map((ingredientModel) => {
      const ingredientAmount = new IngredientAmount({
        ingredient: ingredientModel.name,
        quantity: ingredientModel.recipeIngredients.amount,
      });

      return ingredientAmount;
    });

    const recipe = new Recipe({
      id: recipeModel.id,
      name: recipeModel.name,
      ingredients,
    });

    return recipe;
  }
}
