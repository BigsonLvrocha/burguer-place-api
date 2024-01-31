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
  IngredientModel,
  IngredientModelStatic,
  ingredientModelToken,
} from './db/ingredient.js';
import {
  RecipeIngredientModel,
  RecipeIngredientModelStatic,
  recipeIngredientModelToken,
} from './db/recipe-ingredient.js';
import {
  RecipeModel,
  RecipeModelStatic,
  recipeModelToken,
} from './db/recipe.js';
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

      describe('when there are ingredients already registered', () => {
        let ingredientsCreatedBefore: IngredientModel[];

        beforeAll(async () => {
          await recipeIngredientModel.destroy({ where: {} });
          await recipeModel.destroy({ where: {} });
          await ingredientModel.destroy({ where: {} });

          ingredientsCreatedBefore = await ingredientModel.bulkCreate([
            { name: 'Ingredient 1' },
            { name: 'Ingredient 2' },
          ]);

          await recipeRepository.save(recipe);
        });

        it('creates the recipe', async () => {
          const recipeInDb = await recipeModel.findByPk(recipe.id);
          expect(recipeInDb).not.toBeNull();
          expect(recipeInDb?.name).toBe(recipe.name);
        });

        it('does not duplicate the ingredients', async () => {
          const ingredientsInDb = await ingredientModel.findAll();
          expect(ingredientsInDb).toHaveLength(2);

          const ingredient1 = ingredientsInDb.find(
            (ingredient) => ingredient.name === 'Ingredient 1',
          );
          expect(ingredient1.id).toBe(ingredientsCreatedBefore[0].id);

          const ingredient2 = ingredientsInDb.find(
            (ingredient) => ingredient.name === 'Ingredient 2',
          );
          expect(ingredient2.id).toBe(ingredientsCreatedBefore[1].id);
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
    });

    describe('when the recipe already exists', () => {
      const recipe = new Recipe({
        id: uuid(),
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

      const recipeToSave = new Recipe({
        id: recipe.id,
        name: 'Recipe 2',
        ingredients: [
          new IngredientAmount({
            ingredient: 'Ingredient 1',
            quantity: 2,
          }),
          new IngredientAmount({
            ingredient: 'Ingredient 3',
            quantity: 3,
          }),
        ],
      });

      let createdIngredients: IngredientModel[];
      let createdRecipeIngredients: RecipeIngredientModel[];

      let recipeAfter: RecipeModel;
      let recipeIngredientsAfter: RecipeIngredientModel[];

      beforeAll(async () => {
        await recipeIngredientModel.destroy({ where: {} });
        await recipeModel.destroy({ where: {} });
        await ingredientModel.destroy({ where: {} });
        await recipeModel.create({
          id: recipe.id,
          name: recipe.name,
        });
        createdIngredients = await ingredientModel.bulkCreate([
          { id: uuid(), name: 'Ingredient 1' },
          { id: uuid(), name: 'Ingredient 2' },
        ]);
        createdRecipeIngredients = await recipeIngredientModel.bulkCreate([
          {
            id: uuid(),
            recipeId: recipe.id,
            ingredientId: createdIngredients[0].id,
            amount: 1,
          },
          {
            id: uuid(),
            recipeId: recipe.id,
            ingredientId: createdIngredients[1].id,
            amount: 2,
          },
        ]);

        await recipeRepository.save(recipeToSave);

        recipeAfter = await recipeModel.findByPk(recipe.id);
        recipeIngredientsAfter = await recipeIngredientModel.findAll({
          where: { recipeId: recipe.id },
          include: [IngredientModel],
        });
      });

      it('updates the recipe name', () => {
        expect(recipeAfter.name).toBe(recipeToSave.name);
      });

      it('deletes the recipe ingredients that are not in the new recipe', () => {
        const deletedRecipeIngredient = recipeIngredientsAfter.find(
          (recipeIngredient) =>
            recipeIngredient.ingredientId === createdRecipeIngredients[1].id,
        );
        expect(deletedRecipeIngredient).toBeUndefined();
      });

      it('updates the amount of ingredients that were in the previous recipe', () => {
        const updatedRecipeIngredient = recipeIngredientsAfter.find(
          (recipeIngredient) =>
            recipeIngredient.id === createdRecipeIngredients[0].id,
        );
        expect(updatedRecipeIngredient?.amount).toBe(2);
      });

      it('creates the new recipe ingredients', () => {
        const newRecipeIngredient = recipeIngredientsAfter.find(
          (recipeIngredient) =>
            recipeIngredient.ingredient.name === 'Ingredient 3',
        );
        expect(newRecipeIngredient).not.toBeUndefined();
        expect(newRecipeIngredient?.amount).toBe(3);
      });
    });
  });
});
