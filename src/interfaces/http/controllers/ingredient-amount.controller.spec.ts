import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ListIngredientsUseCase } from '../../../use-cases/list-ingredients-use-case.js';
import { UpdateIngredientAmountUseCase } from '../../../use-cases/update-ingredient-amount-use-case.js';
import { IngredientAmountController } from './ingredient-amount.controller.js';

describe('IngredientAmountController', () => {
  let testModule: TestingModule;
  let mockListIngredientsUseCase: { execute: jest.Mock<any> };
  let mockUpdateIngredientAmountUseCase: { execute: jest.Mock<any> };
  let controller: IngredientAmountController;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      controllers: [IngredientAmountController],
      providers: [
        {
          provide: ListIngredientsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateIngredientAmountUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    mockListIngredientsUseCase = testModule.get(ListIngredientsUseCase);
    mockUpdateIngredientAmountUseCase = testModule.get(
      UpdateIngredientAmountUseCase,
    );
    controller = testModule.get(IngredientAmountController);
  });

  afterAll(async () => {
    await testModule.close();
  });

  describe('get', () => {
    it('should call use case with the correct parameters', async () => {
      const ingredientName = 'Flour';

      mockListIngredientsUseCase.execute.mockResolvedValue([
        {
          name: ingredientName,
          amount: 2,
        },
      ]);

      const response = await controller.get();

      expect(mockListIngredientsUseCase.execute).toHaveBeenCalledTimes(1);

      expect(response).toEqual({
        data: [
          {
            type: 'ingredientAmount',
            attributes: {
              name: ingredientName,
              amount: 2,
            },
          },
        ],
      });
    });
  });

  describe('post', () => {
    it('should call use case with the correct parameters', async () => {
      const ingredientName = 'Flour';
      const ingredientAmount = 2;

      mockUpdateIngredientAmountUseCase.execute.mockResolvedValue({
        ingredient: ingredientName,
        quantity: ingredientAmount,
      });

      const response = await controller.post({
        data: {
          type: 'ingredientAmount',
          attributes: {
            name: ingredientName,
            amount: ingredientAmount,
          },
        },
      });

      expect(mockUpdateIngredientAmountUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(mockUpdateIngredientAmountUseCase.execute).toHaveBeenCalledWith({
        ingredient: ingredientName,
        quantity: ingredientAmount,
      });

      expect(response).toEqual({
        data: {
          type: 'ingredientAmount',
          attributes: {
            name: ingredientName,
            amount: ingredientAmount,
          },
        },
      });
    });
  });
});
