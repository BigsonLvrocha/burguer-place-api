import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { IngredientAmount } from '../domain/ingredient-amount.js';
import { ingredientStorageServiceToken } from '../domain/ingredient-storage-service.js';
import { recipeRepositoryToken } from '../domain/recipe-repository.js';
import { Recipe } from '../domain/recipe.js';
import { ProcessRecipeUseCase } from './process-recipe-use-case.js';

describe('ProcessRecipeUseCase', () => {
  let testModule: TestingModule;
  let recipeRepository: { get: jest.Mock<any> };
  let ingredientStorageService: { processRecipe: jest.Mock<any> };
  let useCase: ProcessRecipeUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        {
          provide: recipeRepositoryToken,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ingredientStorageServiceToken,
          useValue: {
            processRecipe: jest.fn(),
          },
        },
        ProcessRecipeUseCase,
      ],
    }).compile();

    recipeRepository = testModule.get(recipeRepositoryToken);
    ingredientStorageService = testModule.get(ingredientStorageServiceToken);
    useCase = testModule.get(ProcessRecipeUseCase);
  });

  beforeEach(() => {
    recipeRepository.get.mockReset();
    ingredientStorageService.processRecipe.mockReset();
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('process the recipe using the service', async () => {
    recipeRepository.get.mockResolvedValue(
      new Recipe({
        id: 'RecipeId',
        name: 'Recipe Name',
        ingredients: [
          new IngredientAmount({
            ingredient: 'Ingredient',
            quantity: 1,
          }),
        ],
      }),
    );

    await useCase.execute({ recipeId: 'RecipeId' });

    expect(ingredientStorageService.processRecipe).toHaveBeenCalledWith(
      new Recipe({
        id: 'RecipeId',
        name: 'Recipe Name',
        ingredients: [
          new IngredientAmount({
            ingredient: 'Ingredient',
            quantity: 1,
          }),
        ],
      }),
    );
  });
});
