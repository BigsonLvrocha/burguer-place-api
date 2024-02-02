import { config as load } from 'dotenv';

load();

export const config = {
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number.parseInt(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER ?? 'flipper',
    name: process.env.DB_NAME ?? 'burguer',
    pass: process.env.DB_PASS ?? 'postgres',
    passArn: process.env.DB_PASS_ARN,
  },
  aws: {
    region: process.env.AWS_REGION,
  },
};

export type Config = typeof config;
