import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientAmount } from '../domain/ingredient-amount.js';
import { ingredientStorageServiceToken } from '../domain/ingredient-storage-service.js';
import { GetIngredientAmountUseCase } from './get-ingredient-amount-use-case.js';

describe('GetIngredientAmountUseCase', () => {
  let testModule: TestingModule;
  let ingredientStorageService: { getIngredientAmount: jest.Mock<any> };
  let useCase: GetIngredientAmountUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        {
          provide: ingredientStorageServiceToken,
          useValue: {
            getIngredientAmount: jest.fn(),
          },
        },
        GetIngredientAmountUseCase,
      ],
    }).compile();

    ingredientStorageService = testModule.get(ingredientStorageServiceToken);
    useCase = testModule.get(GetIngredientAmountUseCase);
  });

  beforeEach(() => {
    ingredientStorageService.getIngredientAmount.mockReset();
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('returns the ingredient amount', async () => {
    ingredientStorageService.getIngredientAmount.mockResolvedValue(
      new IngredientAmount({
        ingredient: 'Ingredient',
        quantity: 1,
      }),
    );

    const ingredientAmount = await useCase.execute({
      name: 'Ingredient',
    });

    expect(ingredientAmount).toEqual({
      name: 'Ingredient',
      amount: 1,
    });
  });
});
