import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { ConfigModule } from '@nestjs/config';
import { config } from '../config.js';
import { IngredientAmount, Recipe } from '../domain/index.js';
import {
  DbModule,
  IngredientModelStatic,
  ingredientModelToken,
} from './db/index.js';
import { SequelizeIngredientStorageService } from './sequelize-ingredient-storage-service.js';

describe('SequelizeIngredientStorageService', () => {
  const dbName = `test_${uuid().replace(/-/g, '')}`;
  config.database.name = dbName;

  let testSequelize: Sequelize;
  let testModule: TestingModule;

  let service: SequelizeIngredientStorageService;

  let ingredientModel: IngredientModelStatic;

  beforeAll(async () => {
    testSequelize = new Sequelize({
      dialect: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.pass,
      database: 'postgres',
      logging: false,
    });

    await testSequelize.query(`CREATE DATABASE ${dbName};`);

    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              ...config,
              database: {
                ...config.database,
                name: dbName,
              },
            }),
          ],
        }),
        DbModule,
      ],
      providers: [SequelizeIngredientStorageService],
    }).compile();

    ingredientModel = testModule.get(ingredientModelToken);
    service = testModule.get(SequelizeIngredientStorageService);
  });

  afterAll(async () => {
    await testModule.close();
    await testSequelize.query(`DROP DATABASE ${dbName};`);
    await testSequelize.close();
  });

  describe('updateIngredientAmount', () => {
    describe('When ingredient is not in database', () => {
      const ingredientName = `element-${uuid()}`;

      it('should create the ingredient', async () => {
        await service.updateIngredientAmount(
          new IngredientAmount({
            ingredient: ingredientName,
            quantity: 1,
          }),
        );

        const ingredient = await ingredientModel.findOne({
          where: { name: ingredientName },
        });

        expect(ingredient).not.toBeNull();
        expect(ingredient?.amount).toBe(1);
      });
    });

    describe('When ingredient is already in database', () => {
      const ingredientName = `element-${uuid()}`;

      beforeAll(async () => {
        await ingredientModel.create({
          name: ingredientName,
          amount: 1,
        });
      });

      it('should update the ingredient amount', async () => {
        await service.updateIngredientAmount(
          new IngredientAmount({
            ingredient: ingredientName,
            quantity: 2,
          }),
        );

        const ingredient = await ingredientModel.findOne({
          where: { name: ingredientName },
        });

        expect(ingredient).not.toBeNull();
        expect(ingredient?.amount).toBe(2);
      });
    });
  });

  describe('getIngredientAmount', () => {
    describe('When ingredient is not in database', () => {
      const ingredientName = `element-${uuid()}`;

      it('returns 0 amount', async () => {
        const ingredient = await service.getIngredientAmount(ingredientName);

        expect(ingredient).toEqual(
          new IngredientAmount({ ingredient: ingredientName, quantity: 0 }),
        );
      });
    });

    describe('When ingredient is in database', () => {
      it('returns the ingredient amount', async () => {
        const ingredientName = `element-${uuid()}`;

        await ingredientModel.create({
          name: ingredientName,
          amount: 1,
        });

        const result = await service.getIngredientAmount(ingredientName);

        expect(result).toEqual(
          new IngredientAmount({ ingredient: ingredientName, quantity: 1 }),
        );
      });
    });
  });

  describe('processRecipe', () => {
    describe('when all ingredients are available', () => {
      it('should update the ingredient amounts', async () => {
        const ingredientName = `element-${uuid()}`;

        await ingredientModel.create({
          name: ingredientName,
          amount: 1,
        });

        await service.processRecipe(
          new Recipe({
            name: 'recipe',
            ingredients: [
              new IngredientAmount({ ingredient: ingredientName, quantity: 1 }),
            ],
          }),
        );

        const ingredient = await ingredientModel.findOne({
          where: { name: ingredientName },
        });

        expect(ingredient).not.toBeNull();
        expect(ingredient?.amount).toBe(0);
      });
    });

    describe('when an ingredient is not available', () => {
      it('should throw an error', async () => {
        const ingredientName = `element-${uuid()}`;

        await ingredientModel.create({
          name: ingredientName,
          amount: 0,
        });

        await expect(
          service.processRecipe(
            new Recipe({
              name: 'recipe',
              ingredients: [
                new IngredientAmount({
                  ingredient: ingredientName,
                  quantity: 1,
                }),
              ],
            }),
          ),
        ).rejects.toThrow('Not enough ingredients');
      });
    });

    describe('when an ingredient is not in database', () => {
      it('should throw an error', async () => {
        const ingredientName = `element-${uuid()}`;

        await expect(
          service.processRecipe(
            new Recipe({
              name: 'recipe',
              ingredients: [
                new IngredientAmount({
                  ingredient: ingredientName,
                  quantity: 1,
                }),
              ],
            }),
          ),
        ).rejects.toThrow('Not enough ingredients');
      });
    });
  });
});
