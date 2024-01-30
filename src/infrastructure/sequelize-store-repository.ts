import { Inject, Injectable } from '@nestjs/common';
import { Store, StoreRepository } from '../domain/index.js';
import { StoreModelStatic, storeModelToken } from './db/store.js';

@Injectable()
export class SequelizeStoreRepository implements StoreRepository {
  constructor(
    @Inject(storeModelToken) private readonly storeModel: StoreModelStatic,
  ) {}

  async save(store: Store): Promise<void> {
    await this.storeModel.upsert({
      id: store.id,
      name: store.name,
    });
  }

  async get(storeId: string): Promise<Store | null> {
    const store = await this.storeModel.findByPk(storeId);

    if (!store) {
      return null;
    }

    return new Store({ id: store.id, name: store.name });
  }

  async list(): Promise<Store[]> {
    const stores = await this.storeModel.findAll();

    return stores.map((store) => new Store({ id: store.id, name: store.name }));
  }
}
