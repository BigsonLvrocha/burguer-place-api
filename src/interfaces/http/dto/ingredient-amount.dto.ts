import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class IngredientAmountAttributesDto {
  @IsNotEmpty()
  name: string;

  @Min(0)
  @IsNumber()
  @IsInt()
  amount: number;
}

export class IngredientAmountDto {
  @IsEnum(['ingredientAmount'])
  type: 'ingredientAmount';

  @ValidateNested()
  @Type(() => IngredientAmountAttributesDto)
  attributes: IngredientAmountAttributesDto;
}
