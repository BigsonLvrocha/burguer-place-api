import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize';

async function createSequelize(config: ConfigService) {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    port: config.get('DB_PORT'),
    host: config.get('DB_HOST'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASS'),
    database: config.get('DB_NAME'),
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
