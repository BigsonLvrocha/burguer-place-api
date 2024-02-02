import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { recipeRepositoryToken } from '../domain/index.js';
import { DeleteRecipeUseCase } from './delete-recipe-use-case.js';
import { RecipeNotFoundException } from './exceptions/recipe-not-found-exception.js';

describe('DeleteRecipeUseCase', () => {
  let testModule: TestingModule;
  let deleteRecipeUseCase: DeleteRecipeUseCase;
  let recipeRepository: { get: jest.Mock<any>; delete: jest.Mock<any> };

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        DeleteRecipeUseCase,
        {
          provide: recipeRepositoryToken,
          useValue: {
            get: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteRecipeUseCase = testModule.get(DeleteRecipeUseCase);
    recipeRepository = testModule.get(recipeRepositoryToken);
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('should delete the recipe', async () => {
    recipeRepository.get.mockResolvedValueOnce({
      id: '123',
      name: 'Pasta',
      ingredients: [
        {
          ingredient: 'Flour',
          quantity: 1,
        },
        {
          ingredient: 'Water',
          quantity: 1,
        },
      ],
    });

    await deleteRecipeUseCase.execute({ id: '123' });

    expect(recipeRepository.delete).toHaveBeenCalledWith('123');
  });

  it('throw an error if the recipe does not exist', async () => {
    recipeRepository.get.mockResolvedValueOnce(null);

    await expect(deleteRecipeUseCase.execute({ id: '123' })).rejects.toThrow(
      RecipeNotFoundException,
    );
  });
});
