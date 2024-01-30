import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize';

import { DbModule, StoreModelStatic, storeModelToken } from './db/index.js';
import { sequelizeToken } from './db/sequelize.js';

import { ConfigModule } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Store } from '../domain/store.js';
import { SequelizeStoreRepository } from './sequelize-store-repository.js';

describe('sequelize-store-repository', () => {
  let testModule: TestingModule;
  let sequelize: Sequelize;
  let repository: SequelizeStoreRepository;
  let storeModel: StoreModelStatic;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DbModule,
      ],
      providers: [SequelizeStoreRepository],
    }).compile();

    sequelize = testModule.get<Sequelize>(sequelizeToken);
    repository = testModule.get<SequelizeStoreRepository>(
      SequelizeStoreRepository,
    );
    storeModel = testModule.get<StoreModelStatic>(storeModelToken);
  });

  afterAll(async () => {
    await testModule.close();
    await sequelize.close();
  });

  describe('save', () => {
    afterEach(async () => {
      await storeModel.destroy({ where: {} });
    });

    it('saves a new store', async () => {
      const store = new Store({ name: 'Walmart' });
      await repository.save(store);

      const storeInDb = await storeModel.findByPk(store.id);
      expect(storeInDb).toBeInstanceOf(storeModel);
      expect(storeInDb.name).toBe(store.name);
      expect(storeInDb.id).toBe(store.id);
    });

    it("updates a store's name", async () => {
      const storeId = uuid();

      await storeModel.create({ id: storeId, name: 'Walmart' });

      const store = new Store({ id: storeId, name: 'Target' });

      await repository.save(store);

      const storeInDb = await storeModel.findByPk(store.id);
      expect(storeInDb).toBeInstanceOf(storeModel);
      expect(storeInDb.name).toBe(store.name);
      expect(storeInDb.id).toBe(store.id);
    });
  });

  describe('get', () => {
    const storeId = uuid();

    beforeAll(async () => {
      await storeModel.create({ id: storeId, name: 'Walmart' });
    });

    afterAll(async () => {
      await storeModel.destroy({ where: { id: storeId } });
    });

    it('returns the requested store', async () => {
      const store = await repository.get(storeId);

      expect(store).toBeInstanceOf(Store);
      expect(store.id).toBe(storeId);
      expect(store.name).toBe('Walmart');
    });

    it('returns null if the store does not exist', async () => {
      const store = await repository.get(uuid());

      expect(store).toBeNull();
    });
  });

  describe('list', () => {
    const storeId = uuid();

    beforeAll(async () => {
      await storeModel.destroy({ where: {} });
      await storeModel.create({ id: storeId, name: 'Walmart' });
    });

    afterAll(async () => {
      await storeModel.destroy({ where: {} });
    });

    it('returns a list of stores', async () => {
      const stores = await repository.list();
      expect(stores).toHaveLength(1);

      expect(stores[0].id).toBe(storeId);
      expect(stores[0].name).toBe('Walmart');
    });
  });
});
