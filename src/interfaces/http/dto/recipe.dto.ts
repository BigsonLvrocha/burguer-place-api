import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { IngredientAmountDto } from './ingredient-amount.dto.js';

class RecipeAttributesDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientAmountDto)
  ingredients: IngredientAmountDto[];
}

export class RecipeDto {
  @IsEnum(['recipe'])
  type: 'recipe';

  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecipeAttributesDto)
  attributes: RecipeAttributesDto;
}
