import { v4 as uuid } from 'uuid';
import { InvalidStoreNameException } from './errors/invalid-store-name-exception.js';

type StoreProps = {
  id?: string;
  name: string;
};

export class Store {
  public readonly id: string;
  public readonly name: string;

  constructor(props: StoreProps) {
    this.id = props.id ?? uuid();
    this.name = this.parseStoreName(props.name);
  }

  private parseStoreName(name: string): string {
    const parsedName = name.trim();

    if (parsedName === '') {
      throw new InvalidStoreNameException();
    }

    return parsedName;
  }
}
