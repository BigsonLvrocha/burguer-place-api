import { InternalServerErrorException } from '@nestjs/common';

export class InvalidIngredientNameException extends InternalServerErrorException {
  constructor(name: string) {
    super(`Ingredient ${name} as invalid name`);
  }
}
