import { Store } from './store.js';

export const StoreRepositoryToken = Symbol('StoreRepository');

export interface StoreRepository {
  save(store: Store): Promise<void>;
  get(storeId: string): Promise<Store | null>;
  list(): Promise<Store[]>;
}
