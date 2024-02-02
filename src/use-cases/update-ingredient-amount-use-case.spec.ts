import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { IngredientAmount } from '../domain/ingredient-amount.js';
import { ingredientStorageServiceToken } from '../domain/ingredient-storage-service.js';
import { UpdateIngredientAmountUseCase } from './update-ingredient-amount-use-case.js';

describe('UpdateIngredientAmountUseCase', () => {
  let testModule: TestingModule;
  let updateIngredientAmountUseCase: UpdateIngredientAmountUseCase;
  let ingredientService: { updateIngredientAmount: jest.Mock<any> };

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        UpdateIngredientAmountUseCase,
        {
          provide: ingredientStorageServiceToken,
          useValue: {
            updateIngredientAmount: jest.fn(),
          },
        },
      ],
    }).compile();

    updateIngredientAmountUseCase = testModule.get(
      UpdateIngredientAmountUseCase,
    );
    ingredientService = testModule.get(ingredientStorageServiceToken);
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('should update the ingredient amount', async () => {
    const data = await updateIngredientAmountUseCase.execute({
      ingredient: 'Flour',
      quantity: 2,
    });

    expect(ingredientService.updateIngredientAmount).toHaveBeenCalledWith(
      new IngredientAmount({
        ingredient: 'Flour',
        quantity: 2,
      }),
    );

    expect(data).toEqual({
      ingredient: 'Flour',
      quantity: 2,
    });
  });
});
