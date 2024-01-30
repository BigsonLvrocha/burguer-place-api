import { InternalServerErrorException } from '@nestjs/common';

export class InvalidRecipeNameException extends InternalServerErrorException {
  constructor() {
    super('Recipe name is invalid');
  }
}
