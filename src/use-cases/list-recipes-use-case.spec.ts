import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { IngredientAmount } from '../domain/ingredient-amount.js';
import { recipeRepositoryToken } from '../domain/recipe-repository.js';
import { Recipe } from '../domain/recipe.js';
import { ListRecipesUseCase } from './list-recipes-use-case.js';

describe('ListRecipesUseCase', () => {
  let testModule: TestingModule;
  let useCase: ListRecipesUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        ListRecipesUseCase,
        {
          provide: recipeRepositoryToken,
          useValue: {
            list: jest.fn(() => [
              new Recipe({
                id: uuid(),
                name: 'Pasta',
                ingredients: [
                  new IngredientAmount({
                    ingredient: 'Flour',
                    quantity: 1,
                  }),
                ],
              }),
            ]),
          },
        },
      ],
    }).compile();

    useCase = testModule.get(ListRecipesUseCase);
  });

  it('should call repository to list recipes', async () => {
    const repository = testModule.get(recipeRepositoryToken);
    const result = await useCase.execute();
    expect(repository.list).toHaveBeenCalled();

    expect(result).toEqual([
      {
        id: expect.any(String),
        name: 'Pasta',
        ingredients: [
          {
            name: 'Flour',
            amount: 1,
          },
        ],
      },
    ]);
  });
});
