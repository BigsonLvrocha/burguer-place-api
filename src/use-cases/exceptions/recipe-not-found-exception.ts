import { NotFoundException } from '@nestjs/common';

export class RecipeNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Recipe with id ${id} not found`);
  }
}
