import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { CreateOrUpdateRecipeUseCase } from '../../use-cases/create-or-update-recipe-use-case.js';

import { RecipeController } from './recipe.controller.js';

describe('recipe controller', () => {
  let testingModule: TestingModule;
  let mockUseCase: { execute: jest.Mock<any> };
  let controller: RecipeController;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateOrUpdateRecipeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        RecipeController,
      ],
    }).compile();

    mockUseCase = testingModule.get(CreateOrUpdateRecipeUseCase);
    controller = testingModule.get(RecipeController);
  });

  beforeEach(() => {
    mockUseCase.execute.mockReset();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('create', () => {
    it('should call use case with the correct parameters', async () => {
      const recipeId = uuid();
      const request = {
        data: {
          type: 'recipe' as const,
          attributes: {
            name: 'Recipe Name',
            ingredients: [
              {
                name: 'Ingredient',
                amount: 1,
              },
            ],
          },
        },
      };

      mockUseCase.execute.mockResolvedValue({
        id: recipeId,
        name: request.data.attributes.name,
        ingredients: request.data.attributes.ingredients,
      });

      const response = await controller.create(request);

      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        name: request.data.attributes.name,
        ingredients: request.data.attributes.ingredients,
      });

      expect(response).toEqual({
        data: {
          type: 'recipe',
          id: recipeId,
          attributes: {
            name: request.data.attributes.name,
            ingredients: request.data.attributes.ingredients,
          },
        },
      });
    });
  });
});
