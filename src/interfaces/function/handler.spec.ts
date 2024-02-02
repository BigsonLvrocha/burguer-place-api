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
                  type: 'ingredientAmount',
                  attributes: {
                    name: 'Flour',
                    amount: 1,
                  },
                },
                {
                  type: 'ingredientAmount',
                  attributes: {
                    name: 'Water',
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      });

      let response: any;
      let responseBody: any;

      let createdRecipe: RecipeModel | null;
      let createdIngredients: IngredientModel[];
      let createdRecipeIngredients: RecipeIngredientModel[];

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);

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
                  type: 'ingredientAmount',
                  attributes: {
                    name: 'Flour',
                    amount: 1,
                  },
                },
                {
                  type: 'ingredientAmount',
                  attributes: {
                    name: 'Water',
                    amount: 1,
                  },
                },
              ]),
            },
          },
        });
      });

      it('creates the recipe in the database', () => {
        expect(createdRecipe).not.toBeNull();
        expect(createdRecipe?.id).toBe(responseBody.data.id);
      });

      it('creates the recipe with the data passed', () => {
        expect(createdRecipe?.name).toBe('Pasta');
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

    describe('create new recipe with invalid input', () => {
      const request = buildHttpLambdaRequest({
        path: '/recipe',
        method: 'POST',
        body: {
          data: {
            type: 'recipe',
            attributes: {
              name: 'Pasta',
              ingredients: [],
            },
          },
        },
      });

      let response: any;
      let responseBody: any;

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);
      });

      it('returns 400 status code', () => {
        expect(response.statusCode).toBe(400);
      });

      it('returns the error message', () => {
        expect(responseBody).toMatchObject({
          errors: expect.any(Array),
        });
      });
    });
  });

  describe('GET /recipes', () => {
    describe('list no recipes', () => {
      beforeAll(async () => {
        await recipeIngredientModel.destroy({ where: {} });
        await recipeModel.destroy({ where: {} });
      });

      const request = buildHttpLambdaRequest({
        path: '/recipe',
        method: 'GET',
        body: {},
      });

      let response: any;
      let responseBody: any;

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('returns the list of recipes', () => {
        expect(responseBody).toMatchObject({
          data: expect.any(Array),
        });
      });
    });
  });

  describe('Get /recipes/{id}', () => {
    describe('when recipe exists', () => {
      const recipeId = uuid();
      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}',
        path: `/recipe/${recipeId}`,
        method: 'GET',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;
      let responseBody: any;

      beforeAll(async () => {
        await recipeModel.create({
          id: recipeId,
          name: 'Pasta',
        });

        const [ingredient] = await ingredientModel.findOrCreate({
          where: {
            name: 'Flour',
          },
        });

        await recipeIngredientModel.create({
          recipeId,
          ingredientId: ingredient.id,
          amount: 3,
        });

        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('returns the recipe', () => {
        expect(responseBody).toMatchObject({
          data: {
            id: recipeId,
            type: 'recipe',
            attributes: {
              name: 'Pasta',
              ingredients: [
                {
                  type: 'ingredientAmount',
                  attributes: { name: 'Flour', amount: 3 },
                },
              ],
            },
          },
        });
      });
    });

    describe('when recipe does not exist', () => {
      const recipeId = uuid();
      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}',
        path: `/recipe/${recipeId}`,
        method: 'GET',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;
      let responseBody: any;

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('returns the recipe', () => {
        expect(responseBody).toMatchObject({
          data: {},
        });
      });
    });
  });

  describe('DELETE /recipes/{id}', () => {
    describe('when recipe exists', () => {
      const recipeId = uuid();
      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}',
        path: `/recipe/${recipeId}`,
        method: 'DELETE',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;

      beforeAll(async () => {
        await recipeModel.create({
          id: recipeId,
          name: 'White Pasta',
        });

        const [ingredient] = await ingredientModel.findOrCreate({
          where: {
            name: 'White Flour',
          },
        });

        await recipeIngredientModel.create({
          recipeId,
          ingredientId: ingredient.id,
          amount: 3,
        });

        response = await handler(request, lambdaContext, jest.fn());
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });
    });

    describe('when recipe does not exist', () => {
      const recipeId = uuid();
      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}',
        path: `/recipe/${recipeId}`,
        method: 'DELETE',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
      });

      it('returns 404 status code', () => {
        expect(response.statusCode).toBe(404);
      });
    });
  });

  describe('POST /recipes/{id}/process', () => {
    describe('when recipe exists', () => {
      const recipeId = uuid();
      const ingredientName = `element-${uuid()}`;

      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}/process',
        path: `/recipe/${recipeId}/process`,
        method: 'POST',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;

      beforeAll(async () => {
        await recipeModel.create({
          id: recipeId,
          name: 'White Pasta',
        });

        const ingredient = await ingredientModel.create({
          name: ingredientName,
          amount: 4,
        });

        await recipeIngredientModel.create({
          recipeId,
          ingredientId: ingredient.id,
          amount: 3,
        });

        response = await handler(request, lambdaContext, jest.fn());
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('updates the ingredient amount', async () => {
        const ingredientInDb = await ingredientModel.findOne({
          where: { name: ingredientName },
        });
        expect(ingredientInDb?.amount).toBe(1);
      });
    });

    describe('when recipe does not exist', () => {
      const recipeId = uuid();
      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}/process',
        path: `/recipe/${recipeId}/process`,
        method: 'POST',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;

      beforeAll(async () => {
        response = await handler(request, lambdaContext, jest.fn());
      });

      it('returns 404 status code', () => {
        expect(response.statusCode).toBe(404);
      });
    });

    describe('when there is not enough ingredients', () => {
      const recipeId = uuid();
      const ingredientName = `element-${uuid()}`;

      const request = buildHttpLambdaRequest({
        resourcePath: '/recipe/{id}/process',
        path: `/recipe/${recipeId}/process`,
        method: 'POST',
        body: {},
        pathParameters: { id: recipeId },
      });

      let response: any;

      beforeAll(async () => {
        await recipeModel.create({
          id: recipeId,
          name: 'White Pasta',
        });

        const ingredient = await ingredientModel.create({
          name: ingredientName,
          amount: 3,
        });

        await recipeIngredientModel.create({
          recipeId,
          ingredientId: ingredient.id,
          amount: 4,
        });

        response = await handler(request, lambdaContext, jest.fn());
      });

      it('returns 409 status code', () => {
        expect(response.statusCode).toBe(409);
      });
    });
  });

  describe('GET /ingredient-amount', () => {
    describe('list ingredients', () => {
      const request = buildHttpLambdaRequest({
        path: '/ingredient-amount',
        method: 'GET',
        body: {},
      });

      let response: any;
      let responseBody: any;

      beforeAll(async () => {
        await ingredientModel.destroy({ where: {} });
        await ingredientModel.bulkCreate([
          { name: 'Flour', amount: 1 },
          { name: 'Water', amount: 1 },
        ]);

        response = await handler(request, lambdaContext, jest.fn());
        responseBody = JSON.parse(response.body);
      });

      it('returns 200 status code', () => {
        expect(response.statusCode).toBe(200);
      });

      it('returns all the ingredients in the table', () => {
        expect(responseBody.data).toHaveLength(2);
      });

      it('returns the ingredients', () => {
        expect(responseBody).toMatchObject({
          data: expect.arrayContaining([
            {
              type: 'ingredientAmount',
              attributes: {
                name: 'Flour',
                amount: 1,
              },
            },
            {
              type: 'ingredientAmount',
              attributes: {
                name: 'Water',
                amount: 1,
              },
            },
          ]),
        });
      });
    });
  });
});
