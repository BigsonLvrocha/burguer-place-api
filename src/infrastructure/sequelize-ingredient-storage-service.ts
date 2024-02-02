import { Inject, Injectable } from '@nestjs/common';
import {
  IngredientAmount,
  IngredientStorageService,
  Recipe,
} from '../domain//index.js';
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

  processRecipe(recipe: Recipe): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
