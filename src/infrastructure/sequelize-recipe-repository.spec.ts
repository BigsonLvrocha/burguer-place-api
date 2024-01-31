import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { config } from '../config.js';
import { IngredientAmount } from '../domain/ingredient-amount.js';
import { RecipeRepository } from '../domain/recipe-repository.js';
import { Recipe } from '../domain/recipe.js';

import { DbModule } from './db/db.module.js';
import {
  IngredientModelStatic,
  ingredientModelToken,
} from './db/ingredient.js';
import {
  RecipeIngredientModelStatic,
  recipeIngredientModelToken,
} from './db/recipe-ingredient.js';
import { RecipeModelStatic, recipeModelToken } from './db/recipe.js';
import { SequelizeRecipeRepository } from './sequelize-recipe-repository.js';

describe('SequelizeRecipeRepository', () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    port: Number.parseInt(process.env.DB_PORT ?? '5432'),
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    username: process.env.DB_USER,
    logging: false,
    database: 'postgres',
  });
  const dbName = `burguer_test_${uuid().replace(/-/g, '')}`;

  let recipeRepository: RecipeRepository;
  let recipeModel: RecipeModelStatic;
  let ingredientModel: IngredientModelStatic;
  let recipeIngredientModel: RecipeIngredientModelStatic;

  let testModule: TestingModule;

  beforeAll(async () => {
    await sequelize.query(`CREATE DATABASE ${dbName};`);

    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              database: {
                ...config.database,
                name: dbName,
              },
            }),
          ],
        }),
        DbModule,
      ],
      providers: [SequelizeRecipeRepository],
    }).compile();

    recipeRepository = testModule.get(SequelizeRecipeRepository);

    recipeModel = testModule.get(recipeModelToken);
    ingredientModel = testModule.get(ingredientModelToken);
    recipeIngredientModel = testModule.get(recipeIngredientModelToken);
  });

  afterAll(async () => {
    await testModule.close();
    await sequelize.query(`DROP DATABASE ${dbName};`);
    await sequelize.close();
  });

  describe('save', () => {
    describe('when the recipe does not exist', () => {
      const recipe = new Recipe({
        name: 'Recipe 1',
        ingredients: [
          new IngredientAmount({
            ingredient: 'Ingredient 1',
            quantity: 1,
          }),
          new IngredientAmount({
            ingredient: 'Ingredient 2',
            quantity: 2,
          }),
        ],
      });

      describe('when no ingredients are registered', () => {
        beforeAll(async () => {
          await recipeIngredientModel.destroy({ where: {} });
          await recipeModel.destroy({ where: {} });
          await ingredientModel.destroy({ where: {} });

          await recipeRepository.save(recipe);
        });

        it('creates the recipe', async () => {
          const recipeInDb = await recipeModel.findByPk(recipe.id);
          expect(recipeInDb).not.toBeNull();
          expect(recipeInDb?.name).toBe(recipe.name);
        });

        it('creates the ingredients', async () => {
          const ingredientsInDb = await ingredientModel.findAll();
          expect(ingredientsInDb).toHaveLength(2);

          const ingredientNames = ingredientsInDb.map(
            (ingredient) => ingredient.name,
          );
          expect(ingredientNames).toContain('Ingredient 1');
          expect(ingredientNames).toContain('Ingredient 2');
        });

        it('creates the recipe ingredients', async () => {
          const recipeIngredientsInDb = await recipeIngredientModel.findAll({
            where: { recipeId: recipe.id },
          });
          expect(recipeIngredientsInDb).toHaveLength(2);

          const recipeIngredients = recipeIngredientsInDb.map(
            (recipeIngredient) => ({
              recipeId: recipeIngredient.recipeId,
              ingredientId: recipeIngredient.ingredientId,
              quantity: recipeIngredient.amount,
            }),
          );
          expect(recipeIngredients).toContainEqual({
            recipeId: recipe.id,
            ingredientId: expect.any(String),
            quantity: 1,
          });
          expect(recipeIngredients).toContainEqual({
            recipeId: recipe.id,
            ingredientId: expect.any(String),
            quantity: 2,
          });
        });
      });

      beforeAll(async () => {
        await recipeRepository.save(recipe);
      });
    });
  });
});
