import {
  Body,
  Controller,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrUpdateRecipeUseCase } from '../../../use-cases/create-or-update-recipe-use-case.js';
import { CreateRecipeRequestDto } from '../dto/create-recipe.request.dto.js';

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly createOrUpdateRecipeUseCase: CreateOrUpdateRecipeUseCase,
  ) {}

  @Put(':id')
  @Post()
  @Header('Content-Type', 'application/vnd.api+json')
  async create(
    @Body() body: CreateRecipeRequestDto,
    @Param('id', new ParseUUIDPipe({ optional: true })) id?: string,
  ) {
    const recipeToCreate = {
      id: id ?? body.data.id,
      name: body.data.attributes.name,
      ingredients: body.data.attributes.ingredients,
    };

    const data = await this.createOrUpdateRecipeUseCase.execute(recipeToCreate);
    return {
      data: {
        type: 'recipe',
        id: data.id,
        attributes: {
          name: data.name,
          ingredients: data.ingredients,
        },
      },
    };
  }
}
