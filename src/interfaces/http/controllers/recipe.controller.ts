import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  CreateOrUpdateRecipeUseCase,
  DeleteRecipeUseCase,
  GetRecipeUseCase,
  ListRecipesUseCase,
  ProcessRecipeUseCase,
} from '../../../use-cases/index.js';
import { CreateRecipeRequestDto } from '../dto/create-recipe.request.dto.js';
import { AllExceptionsFilter } from './exception-handler.js';

@UseFilters(AllExceptionsFilter)
@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly createOrUpdateRecipeUseCase: CreateOrUpdateRecipeUseCase,
    private readonly listRecipesUseCase: ListRecipesUseCase,
    private readonly getRecipeUseCase: GetRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
    private readonly processRecipeUseCase: ProcessRecipeUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async create(@Body() body: CreateRecipeRequestDto) {
    const recipeToCreate = {
      id: body.data.id,
      name: body.data.attributes.name,
      ingredients: body.data.attributes.ingredients.map((ingredient) => ({
        name: ingredient.attributes.name,
        amount: ingredient.attributes.amount,
      })),
    };

    const data = await this.createOrUpdateRecipeUseCase.execute(recipeToCreate);
    return {
      data: {
        type: 'recipe',
        id: data.id,
        attributes: {
          name: data.name,
          ingredients: data.ingredients.map((ingredient) => ({
            type: 'ingredientAmount',
            attributes: {
              name: ingredient.name,
              amount: ingredient.amount,
            },
          })),
        },
      },
    };
  }

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async list() {
    const data = await this.listRecipesUseCase.execute();
    return {
      data: data.map((recipe) => ({
        type: 'recipe',
        id: recipe.id,
        attributes: {
          name: recipe.name,
          ingredients: recipe.ingredients.map((ingredient) => ({
            type: 'ingredientAmount',
            attributes: {
              name: ingredient.name,
              amount: ingredient.amount,
            },
          })),
        },
      })),
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async get(@Param('id') id: string) {
    const data = await this.getRecipeUseCase.execute({ id });

    if (data === null || data === undefined) {
      return { data: {} };
    }

    return {
      data: {
        type: 'recipe',
        id: data.id,
        attributes: {
          name: data.name,
          ingredients: data.ingredients.map((ingredient) => ({
            type: 'ingredientAmount',
            attributes: {
              name: ingredient.name,
              amount: ingredient.amount,
            },
          })),
        },
      },
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async delete(@Param('id') id: string) {
    await this.deleteRecipeUseCase.execute({
      id,
    });
  }

  @Post(':id/process')
  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.api+json')
  async process(@Param('id') id: string) {
    await this.processRecipeUseCase.execute({ recipeId: id });
  }
}
