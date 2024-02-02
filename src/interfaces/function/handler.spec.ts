import { jest } from '@jest/globals';
import { Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { INestApplication } from '@nestjs/common';
import { Context, Handler } from 'aws-lambda';
import { config } from '../../config.js';
import {
  IngredientModel,
  IngredientModelStatic,
  RecipeIngredientModel,
  RecipeIngredientModelStatic,
  RecipeModel,
  RecipeModelStatic,
  ingredientModelToken,
  recipeIngredientModelToken,
  recipeModelToken,
} from '../../infrastructure/db/index.js';
import { buildHttpLambdaRequest } from './fixtures/event-builder.js';
import { initHandler } from './handler.js';

describe('lambda handler', () => {
  const testDbId = `burguer_test_${uuid().replace(/-/g, '')}`;
  config.database.name = testDbId;

  const lambdaContext: Context = {
    awsRequestId: '123',
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'test',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test',
    logGroupName: 'test',
    logStreamName: 'test',
    memoryLimitInMB: '128',
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
    getRemainingTimeInMillis: jest.fn(() => 1000),
  };

  let sequelize: Sequelize;

  let nestApp: INestApplication;
  let handler: Handler;

  let recipeModel: RecipeModelStatic;
  let ingredientModel: IngredientModelStatic;
  let recipeIngredientModel: RecipeIngredientModelStatic;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.pass,
      database: 'postgres',
      logging: false,
    });

    await sequelize.query(`CREATE DATABASE ${testDbId}`);

    ({ handler, nestApp } = await initHandler());

    recipeModel = nestApp.get(recipeModelToken);
    ingredientModel = nestApp.get(ingredientModelToken);
    recipeIngredientModel = nestApp.get(recipeIngredientModelToken);
  });

  afterAll(async () => {
    await nestApp.close();
    await sequelize.query(`DROP DATABASE ${testDbId}`);
    await sequelize.close();
  });

  describe('POST /recipe', () => {
    describe('create new recipe with valid input', () => {
      const request = buildHttpLambdaRequest({
        path: '/recipe',
        method: 'POST',
        body: {
          data: {
            type: 'recipe',
            attributes: {
              name: 'Pasta',
              ingredients: [
                {
                  name: 'Flour',
                  amount: 1,
                },
                {
                  name: 'Water',
                  amount: 1,
                },
              ],
            },
          },
        },
      });

      let response: any;
      let responseBody: any;

      let createdRecipe: RecipeModel;
      let createdIngredients: IngredientModel[];
      let createdRecipeIngredients: RecipeIngredientModel[];

      beforeAll(async () => {
        response = await handler(request, lambdaContext, null);
        responseBody = JSON.parse(response.body);

        console.log(response);
        console.log(responseBody);
        createdRecipe = await recipeModel.findByPk(responseBody.data.id);

        createdRecipeIngredients = await recipeIngredientModel.findAll({
          where: { recipeId: responseBody.data.id },
        });

        createdIngredients = await ingredientModel.findAll({
          where: { id: createdRecipeIngredients.map((ri) => ri.ingredientId) },
        });
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('returns the created recipe', () => {
        expect(responseBody).toMatchObject({
          data: {
            id: expect.any(String),
            type: 'recipe',
            attributes: {
              name: 'Pasta',
              ingredients: expect.arrayContaining([
                {
                  name: 'Flour',
                  amount: 1,
                },
                {
                  name: 'Water',
                  amount: 1,
                },
              ]),
            },
          },
        });
      });

      it('creates the recipe in the database', () => {
        expect(createdRecipe).not.toBeNull();
        expect(createdRecipe.id).toBe(responseBody.data.id);
      });

      it('creates the recipe with the data passed', () => {
        expect(createdRecipe.name).toBe('Pasta');
      });

      it('creates the ingredients in the database', () => {
        expect(createdIngredients).toHaveLength(2);
      });

      it('creates the ingredients with the data passed', () => {
        expect(createdIngredients).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'Flour' }),
            expect.objectContaining({ name: 'Water' }),
          ]),
        );
      });

      it('creates the recipe ingredients in the database', () => {
        expect(createdRecipeIngredients).toHaveLength(2);
      });

      it('creates the recipe ingredients with the data passed', () => {
        expect(createdRecipeIngredients).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ recipeId: responseBody.data.id }),
            expect.objectContaining({ recipeId: responseBody.data.id }),
          ]),
        );
      });
    });
  });
});
