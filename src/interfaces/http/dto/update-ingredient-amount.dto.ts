import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IngredientAmountDto } from './ingredient-amount.dto.js';

export class UpdateIngredientAmountDto {
  @ValidateNested()
  @Type(() => IngredientAmountDto)
  data: IngredientAmountDto;
}
