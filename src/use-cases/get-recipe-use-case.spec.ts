import { Test, TestingModule } from '@nestjs/testing';
import {
  IngredientAmount,
  Recipe,
  recipeRepositoryToken,
} from '../domain/index.js';
import { GetRecipeUseCase } from './get-recipe-use-case.js';

describe('GetRecipeUseCase', () => {
  let testModule: TestingModule;
  let recipeRepository: { find: jest.Mock };
  let useCase: GetRecipeUseCase;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      providers: [
        {
          provide: recipeRepositoryToken,
          useValue: {
            find: jest.fn(),
          },
        },
        GetRecipeUseCase,
      ],
    }).compile();

    recipeRepository = testModule.get(recipeRepositoryToken);
    useCase = testModule.get(GetRecipeUseCase);
  });

  beforeEach(() => {
    recipeRepository.find.mockReset();
  });

  afterAll(async () => {
    await testModule.close();
  });

  it('returns the recipe via repository', async () => {
    recipeRepository.find.mockResolvedValue(
      new Recipe({
        id: 'RecipeId',
        name: 'Recipe Name',
        ingredients: [
          new IngredientAmount({
            ingredient: 'Ingredient',
            quantity: 1,
          }),
        ],
      }),
    );

    const recipe = await useCase.execute({ id: 'RecipeId' });

    expect(recipe).toMatchObject({
      id: 'RecipeId',
      name: 'Recipe Name',
      ingredients: [
        {
          name: 'Ingredient',
          amount: 1,
        },
      ],
    });
  });
});
