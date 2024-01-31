import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config.js';
import { Sequelize } from 'sequelize';

async function createSequelize(config: ConfigService) {
  const databaseConfig = config.get<Config['database']>('database');

  const sequelize = new Sequelize({
    dialect: 'postgres',
    port: databaseConfig.port,
    host: databaseConfig.host,
    username: databaseConfig.user,
    password: databaseConfig.pass,
    database: databaseConfig.name,
    logging: false,
  });

  await sequelize.authenticate();

  return sequelize;
}

export const sequelizeToken = Symbol('SEQUELIZE');

export const sequelizeProvider: FactoryProvider = {
  provide: sequelizeToken,
  useFactory: createSequelize,
  inject: [ConfigService],
};
