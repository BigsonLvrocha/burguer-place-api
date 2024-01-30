import { validate } from 'uuid';
import { InvalidStoreNameException } from './errors/invalid-store-name-exception.js';
import { Store } from './store.js';

describe('store', () => {
  it('creates a store with a uuid id', () => {
    const store = new Store({ name: 'Walmart' });
    expect(store).toBeInstanceOf(Store);
    expect(store.id).toBeDefined();
    expect(validate(store.id)).toBe(true);
    expect(store.name).toBe('Walmart');
  });

  it('throws an error if the store name is empty', () => {
    expect(() => new Store({ name: '' })).toThrow(InvalidStoreNameException);
  });
});
