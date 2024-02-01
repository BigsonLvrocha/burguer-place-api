import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class IngredientAmountDto {
  @IsNotEmpty()
  name: string;

  @Min(1)
  @IsNumber()
  @IsInt()
  amount: number;
}

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
