import { Test, TestingModule } from '@nestjs/testing';

import { Recipe, recipeRepositoryToken } from '../domain/index.js';
import { CreateOrUpdateRecipeUseCase } from './create-or-update-recipe-use-case.js';

describe('CreateOrUpdateRecipeUseCase', () => {
  let testModule: TestingModule;
  let recipeRepository: { save: jest.Mock };
  let useCase: CreateOrUpdateRecipeUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        {
          provide: recipeRepositoryToken,
          useValue: {
            save: jest.fn(),
          },
        },
        CreateOrUpdateRecipeUseCase,
      ],
    }).compile();

    recipeRepository = testModule.get(recipeRepositoryToken);
    useCase = testModule.get(CreateOrUpdateRecipeUseCase);
  });

  beforeEach(() => {
    recipeRepository.save.mockReset();
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('creates the recipe via repository', async () => {
    await useCase.execute({
      name: 'Recipe Name',
      ingredients: [
        {
          name: 'Ingredient',
          amount: 1,
        },
      ],
    });

    expect(recipeRepository.save).toHaveBeenCalledTimes(1);
    const recipe = recipeRepository.save.mock.calls[0][0];

    expect(recipe).toBeInstanceOf(Recipe);
    expect(recipe.name).toBe('Recipe Name');

    expect(recipe.ingredients).toHaveLength(1);
    expect(recipe.ingredients[0].ingredient).toBe('Ingredient');
    expect(recipe.ingredients[0].quantity).toBe(1);
  });
});
