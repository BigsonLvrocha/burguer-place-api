import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config.js';
import { Sequelize } from 'sequelize';

export const dbConfigurationToken = Symbol('SEQUELIZE_PASSWORD');

async function getDbConfiguration(config: ConfigService) {
  const databaseConfig = config.get<Config['database']>('database');

  if (!databaseConfig) {
    throw new Error('Database configuration not found');
  }

  if (databaseConfig.pass || !databaseConfig.passArn) {
    return databaseConfig;
  }

  const awsRegion = config.get<string>('aws.region');

  if (!awsRegion) return databaseConfig;

  const client = new SecretsManagerClient({
    region: awsRegion,
    apiVersion: '2017-10-17',
  });

  const command = new GetSecretValueCommand({
    SecretId: databaseConfig.passArn,
  });

  const response = await client.send(command);

  const data = JSON.parse(response.SecretString ?? '{}');

  return {
    ...databaseConfig,
    pass: data.password,
  };
}

export const dbConfigurationProvider: FactoryProvider = {
  provide: dbConfigurationToken,
  useFactory: getDbConfiguration,
  inject: [ConfigService],
};

async function createSequelize(config: Config['database']) {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    port: config.port,
    host: config.host,
    username: config.user,
    password: config.pass,
    database: config.name,
    logging: false,
  });

  await sequelize.authenticate();

  return sequelize;
}

export const sequelizeToken = Symbol('SEQUELIZE');

export const sequelizeProvider: FactoryProvider = {
  provide: sequelizeToken,
  useFactory: createSequelize,
  inject: [dbConfigurationToken],
};
