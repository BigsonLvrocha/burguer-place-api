import { Inject, Injectable } from '@nestjs/common';
import {
  IngredientAmount,
  IngredientStorageService,
  Recipe,
} from '../domain//index.js';
import { NotEnoughIngredientsException } from '../domain/errors/not-enough-ingredients-exceptions.js';
import { IngredientModelStatic, ingredientModelToken } from './db/index.js';

@Injectable()
export class SequelizeIngredientStorageService
  implements IngredientStorageService
{
  constructor(
    @Inject(ingredientModelToken)
    private readonly ingredientModel: IngredientModelStatic,
  ) {}

  async updateIngredientAmount(amount: IngredientAmount): Promise<void> {
    await this.ingredientModel.upsert({
      amount: amount.quantity,
      name: amount.ingredient,
    });
  }

  async getIngredientAmount(ingredient: string): Promise<IngredientAmount> {
    const data = await this.ingredientModel.findOne({
      where: { name: ingredient },
    });

    if (!data) {
      return new IngredientAmount({ ingredient, quantity: 0 });
    }

    return new IngredientAmount({ ingredient, quantity: data.amount });
  }

  async processRecipe(recipe: Recipe): Promise<void> {
    await this.ingredientModel.sequelize?.transaction(async (transaction) => {
      const ingredients = await this.ingredientModel.findAll({
        where: {
          name: recipe.ingredients.map((i) => i.ingredient),
        },
        transaction,
      });

      if (ingredients.length !== recipe.ingredients.length) {
        throw new NotEnoughIngredientsException();
      }

      const ingredientsAmountMap = new Map(
        recipe.ingredients.map((i) => [i.ingredient, i.quantity]),
      );

      for (const ingredient of ingredients) {
        const newAmount =
          ingredient.amount - (ingredientsAmountMap.get(ingredient.name) ?? 0);

        if (newAmount < 0) {
          throw new NotEnoughIngredientsException();
        }

        await ingredient.update({ amount: newAmount }, { transaction });
      }
    });
  }

  async listIngredients(): Promise<IngredientAmount[]> {
    const ingredients = await this.ingredientModel.findAll();
    return ingredients.map(
      (i) => new IngredientAmount({ ingredient: i.name, quantity: i.amount }),
    );
  }
}
