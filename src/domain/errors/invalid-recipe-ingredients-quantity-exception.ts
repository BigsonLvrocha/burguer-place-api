import { InternalServerErrorException } from '@nestjs/common';

export class InvalidRecipeIngredientsQuantityException extends InternalServerErrorException {
  constructor() {
    super(`Recipe should have at least one ingredient`);
  }
}
