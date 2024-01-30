import { InternalServerErrorException } from '@nestjs/common';

export class InvalidIngredientQuantityException extends InternalServerErrorException {
  constructor(ingredient: string, quantity: number) {
    super(`Ingredient ${ingredient} as invalid quantity: ${quantity}`);
  }
}
