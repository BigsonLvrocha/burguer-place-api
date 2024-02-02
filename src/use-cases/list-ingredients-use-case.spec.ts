import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { IngredientAmount } from '../domain/ingredient-amount.js';
import { ingredientStorageServiceToken } from '../domain/ingredient-storage-service.js';
import { ListIngredientsUseCase } from './list-ingredients-use-case.js';

describe('ListIngredientsUseCase', () => {
  let testModule: TestingModule;
  let ingredientStorageService: { listIngredients: jest.Mock<any> };
  let useCase: ListIngredientsUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        {
          provide: ingredientStorageServiceToken,
          useValue: {
            listIngredients: jest.fn(),
          },
        },
        ListIngredientsUseCase,
      ],
    }).compile();

    ingredientStorageService = testModule.get(ingredientStorageServiceToken);
    useCase = testModule.get(ListIngredientsUseCase);
  });

  beforeEach(() => {
    ingredientStorageService.listIngredients.mockReset();
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('returns the list of ingredients', async () => {
    ingredientStorageService.listIngredients.mockResolvedValue([
      new IngredientAmount({
        ingredient: 'Ingredient',
        quantity: 1,
      }),
    ]);

    const ingredients = await useCase.execute();

    expect(ingredients).toEqual([
      {
        name: 'Ingredient',
        amount: 1,
      },
    ]);
  });
});
