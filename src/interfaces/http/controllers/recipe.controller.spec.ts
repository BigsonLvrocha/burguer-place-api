import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import {
  CreateOrUpdateRecipeUseCase,
  DeleteRecipeUseCase,
  GetRecipeUseCase,
  ListRecipesUseCase,
} from '../../../use-cases/index.js';

import { RecipeController } from './recipe.controller.js';

describe('recipe controller', () => {
  let testingModule: TestingModule;
  let mockCreateOrUpdateUseCase: { execute: jest.Mock<any> };
  let mockListRecipesUseCase: { execute: jest.Mock<any> };
  let mockGetRecipeUseCase: { execute: jest.Mock<any> };
  let mockDeleteRecipeUseCase: { execute: jest.Mock<any> };
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
        {
          provide: ListRecipesUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetRecipeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteRecipeUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        RecipeController,
      ],
    }).compile();

    mockCreateOrUpdateUseCase = testingModule.get(CreateOrUpdateRecipeUseCase);
    mockListRecipesUseCase = testingModule.get(ListRecipesUseCase);
    mockGetRecipeUseCase = testingModule.get(GetRecipeUseCase);
    mockDeleteRecipeUseCase = testingModule.get(DeleteRecipeUseCase);
    controller = testingModule.get(RecipeController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
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

      mockCreateOrUpdateUseCase.execute.mockResolvedValue({
        id: recipeId,
        name: request.data.attributes.name,
        ingredients: request.data.attributes.ingredients,
      });

      const response = await controller.create(request);

      expect(mockCreateOrUpdateUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockCreateOrUpdateUseCase.execute).toHaveBeenCalledWith({
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

  describe('list', () => {
    it('should call use case and return the result', async () => {
      const recipeId = uuid();
      mockListRecipesUseCase.execute.mockResolvedValue([
        {
          id: recipeId,
          name: 'Recipe Name',
          ingredients: [
            {
              name: 'Ingredient',
              amount: 1,
            },
          ],
        },
      ]);

      const response = await controller.list();

      expect(mockListRecipesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        data: [
          {
            type: 'recipe',
            id: recipeId,
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
        ],
      });
    });
  });

  describe('get', () => {
    it('should call use case with the correct parameters', async () => {
      const recipeId = uuid();
      mockGetRecipeUseCase.execute.mockResolvedValue({
        id: recipeId,
        name: 'Recipe Name',
        ingredients: [
          {
            name: 'Ingredient',
            amount: 1,
          },
        ],
      });

      const response = await controller.get(recipeId);

      expect(mockGetRecipeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockGetRecipeUseCase.execute).toHaveBeenCalledWith({
        id: recipeId,
      });

      expect(response).toEqual({
        data: {
          type: 'recipe',
          id: recipeId,
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
      });
    });

    it('should return an empty object if the recipe does not exist', async () => {
      mockGetRecipeUseCase.execute.mockResolvedValue(null);

      const response = await controller.get(uuid());

      expect(response).toEqual({ data: {} });
    });
  });

  describe('delete', () => {
    it('should call use case with the correct parameters', async () => {
      const recipeId = uuid();

      await controller.delete(recipeId);

      expect(mockDeleteRecipeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockDeleteRecipeUseCase.execute).toHaveBeenCalledWith({
        id: recipeId,
      });
    });
  });
});
