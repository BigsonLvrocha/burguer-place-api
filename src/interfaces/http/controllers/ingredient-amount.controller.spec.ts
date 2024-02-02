import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ListIngredientsUseCase } from '../../../use-cases/list-ingredients-use-case.js';
import { IngredientAmountController } from './ingredient-amount.controller.js';

describe('IngredientAmountController', () => {
  let testModule: TestingModule;
  let mockListIngredientsUseCase: { execute: jest.Mock<any> };
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
      ],
    }).compile();

    mockListIngredientsUseCase = testModule.get(ListIngredientsUseCase);
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
});
