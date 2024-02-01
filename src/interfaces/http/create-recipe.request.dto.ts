import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { RecipeDto } from './recipe.dto.js';

export class CreateRecipeRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecipeDto)
  data: RecipeDto;
}
