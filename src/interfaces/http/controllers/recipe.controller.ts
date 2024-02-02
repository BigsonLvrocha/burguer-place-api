import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { CreateOrUpdateRecipeUseCase } from '../../../use-cases/create-or-update-recipe-use-case.js';
import { CreateRecipeRequestDto } from '../dto/create-recipe.request.dto.js';

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly createOrUpdateRecipeUseCase: CreateOrUpdateRecipeUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async create(@Body() body: CreateRecipeRequestDto) {
    const recipeToCreate = {
      id: body.data.id,
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
