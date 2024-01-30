import { InternalServerErrorException } from '@nestjs/common';

export class InvalidStoreNameException extends InternalServerErrorException {
  constructor() {
    super('Store name is invalid');
  }
}
