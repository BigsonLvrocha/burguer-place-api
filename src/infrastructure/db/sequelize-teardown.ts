import { Inject, OnModuleDestroy } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { sequelizeToken } from './sequelize.js';

export class SequelizeTearDown implements OnModuleDestroy {
  constructor(@Inject(sequelizeToken) private readonly sequelize: Sequelize) {}

  async onModuleDestroy() {
    await this.sequelize.close();
  }
}
