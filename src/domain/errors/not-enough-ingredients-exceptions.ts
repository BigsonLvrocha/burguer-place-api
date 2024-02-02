import { ConflictException } from '@nestjs/common';

export class NotEnoughIngredientsException extends ConflictException {
  constructor() {
    super('Not enough ingredients to process recipe');
  }
}
